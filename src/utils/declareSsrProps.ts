import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { createServerSideHelpers, DecoratedProcedureSSGRecord } from '@trpc/react-query/server';
import superjson from 'superjson';

import { routes } from '../hooks/router';
import { trpcRouter } from '../../trpc/router';
import type { TrpcRouter } from '../../trpc/router';

import { setSSRLocale, TLocale } from './getLang';

interface SSRProps<P = { [key: string]: string }> {
    user: Session['user'];
    locale: TLocale;
    req: GetServerSidePropsContext['req'];
    params: P;
    query: Record<string, string | string[] | undefined>;
    ssrTime: number;
    ssrHelpers: DecoratedProcedureSSGRecord<TrpcRouter>;
}

export interface ExternalPageProps<P = { [key: string]: string }> extends SSRProps<P> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export function declareSsrProps<T = ExternalPageProps>(
    cb?: ({ user, locale, req, params, query }: SSRProps) => T,
    options?: { private: boolean },
) {
    return async ({ locale, req, params = {}, query }: GetServerSidePropsContext) => {
        // FIXME: getServerSession. Problem with serialazing createdAt, updatedAt
        const session = await getSession({ req });

        if (options?.private && !session) {
            return {
                redirect: {
                    destination: routes.signIn(),
                    permanent: false,
                },
            };
        }

        if (locale) {
            setSSRLocale(locale as TLocale);
        }

        const ssrHelpers = createServerSideHelpers({ router: trpcRouter, ctx: { session }, transformer: superjson });

        const ssrTime = Date.now();

        const resProps = cb
            ? await cb({
                  req,
                  // look at session check in previous condition
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  user: session!.user,
                  locale: locale as TLocale,
                  params: params as Record<string, string>,
                  query,
                  ssrTime,
                  ssrHelpers,
              })
            : {};

        // @ts-ignore
        if (resProps?.notFound) {
            return resProps;
        }

        return {
            props: {
                ...resProps,
                locale,
                params: params as Record<string, string>,
                user: session ? session.user : null,
                ssrTime,
                trpcState: ssrHelpers.dehydrate(),
            },
        };
    };
}
