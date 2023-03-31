import useSWR from 'swr';

import { createFetcher, refreshInterval } from '../../../utils/createFetcher';
import { declareSsrProps, ExternalPageProps } from '../../../utils/declareSsrProps';
import { routes } from '../../../hooks/router';
import { Page, PageContent } from '../../Page';
import { PageSep } from '../../PageSep';
import { nullable } from '../../../utils/nullable';
import { ExplorePageLayout } from '../../ExplorePageLayout';
import { ParentListItem } from '../../ParentListItem';

import { tr } from './ExploreTeamsPage.i18n';

const fetcher = createFetcher(() => ({
    teams: [
        {
            data: {},
        },
        {
            id: true,
            key: true,
            title: true,
            description: true,
            projects: {
                id: true,
            },
            activity: {
                user: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
                ghost: {
                    id: true,
                    email: true,
                },
            },
            createdAt: true,
        },
    ],
}));

export const getServerSideProps = declareSsrProps(
    async ({ user }) => ({
        fallback: {
            'explore/teams': await fetcher(user),
        },
    }),
    {
        private: true,
    },
);

export const ExploreTeamsPage = ({ user, locale, ssrTime, fallback }: ExternalPageProps) => {
    const { data } = useSWR('explore/teams', () => fetcher(user), {
        fallback,
        refreshInterval,
    });
    const teams = data?.teams;

    return (
        <Page user={user} locale={locale} ssrTime={ssrTime} title={tr('title')}>
            <ExplorePageLayout>
                <PageSep />

                <PageContent>
                    {teams?.map((team) =>
                        nullable(team, (te) => (
                            <ParentListItem
                                key={te.key}
                                href={routes.team(te.key)}
                                createdAt={te.createdAt}
                                title={te.title}
                                description={te.description}
                                activity={te.activity}
                            />
                        )),
                    )}
                </PageContent>
            </ExplorePageLayout>
        </Page>
    );
};
