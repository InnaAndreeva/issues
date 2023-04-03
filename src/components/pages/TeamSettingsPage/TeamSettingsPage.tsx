/* eslint-disable react-hooks/rules-of-hooks */
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import toast from 'react-hot-toast';
import { useRouter as useNextRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { gapS, gray9, warn0 } from '../../../design/@generated/themes';
import { createFetcher, refreshInterval } from '../../../utils/createFetcher';
import { Team } from '../../../../graphql/@generated/genql';
import { Button } from '../../Button';
import { declareSsrProps, ExternalPageProps } from '../../../utils/declareSsrProps';
import { dispatchModalEvent, ModalEvent } from '../../../utils/dispatchModal';
import { PageSep } from '../../PageSep';
import { SettingsCard, SettingsContent } from '../../SettingsContent';
import { Form } from '../../Form';
import { Fieldset } from '../../Fieldset';
import { gql } from '../../../utils/gql';
import { FormInput } from '../../FormInput';
import { FormAction, FormActions } from '../../FormActions';
import { TeamPageLayout } from '../../TeamPageLayout';
import { Page } from '../../Page';
import { FormMultiInput } from '../../FormMultiInput';
import { Text } from '../../Text';
import { useRouter } from '../../../hooks/router';
import { ModalContent, ModalHeader } from '../../Modal';
import { FormTitle } from '../../FormTitle';

import { tr } from './TeamSettingsPage.i18n';

const ModalOnEvent = dynamic(() => import('../../ModalOnEvent'));

const teamFetcher = createFetcher((_, key: string) => ({
    team: [
        {
            key,
        },
        {
            id: true,
            key: true,
            title: true,
            description: true,
            activityId: true,
            projects: {
                id: true,
                key: true,
                title: true,
                description: true,
                createdAt: true,
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
            },
            watchers: {
                id: true,
            },
            stargizers: {
                id: true,
            },
            participants: {
                id: true,
                user: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                },
            },
            createdAt: true,
            activity: {
                id: true,
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
        },
    ],
}));

const projectsFetcher = createFetcher((_, query: string) => ({
    projectCompletion: [
        {
            query,
        },
        {
            id: true,
            title: true,
            description: true,
        },
    ],
}));

export const getServerSideProps = declareSsrProps(
    async ({ user, params: { key } }) => {
        const ssrData = await teamFetcher(user, key);

        return ssrData.team
            ? {
                  fallback: {
                      [key]: ssrData,
                  },
              }
            : {
                  notFound: true,
              };
    },
    {
        private: true,
    },
);

const schemaProvider = () =>
    z.object({
        title: z
            .string({
                required_error: tr("Team's title is required"),
                invalid_type_error: tr("Team's title must be a string"),
            })
            .min(2, {
                message: tr("Team's title must be longer than 2 symbols"),
            })
            .max(50, {
                message: tr("Team's title can be 50 symbols maximum"),
            }),
        description: z.string().optional(),
        projects: z
            .array(
                z.object({
                    id: z.number(),
                    title: z.string(),
                }),
            )
            .optional(),
    });

type FormType = z.infer<ReturnType<typeof schemaProvider>>;

export const TeamSettingsPage = ({
    user,
    locale,
    ssrTime,
    fallback,
    params: { key },
}: ExternalPageProps<{ key: string }>) => {
    const router = useRouter();
    const schema = schemaProvider();
    const nextRouter = useNextRouter();

    const { data } = useSWR(key, () => teamFetcher(user, key), {
        fallback,
        refreshInterval,
    });

    if (!data) return null;

    const team = data?.team;

    if (!team) return nextRouter.push('/404');

    const [actualFields, setActualFields] = useState<Pick<Team, 'title' | 'description' | 'projects'>>({
        title: team.title,
        description: team.description || '',
        projects: team.projects ?? [],
    });
    const [formChanged, setFormChanged] = useState(false);

    const { handleSubmit, watch, register, control, formState } = useForm<FormType>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldFocusError: true,
        defaultValues: actualFields,
    });

    const formValues = watch();

    useEffect(() => {
        if (
            formValues.title !== actualFields.title ||
            formValues.description !== actualFields.description ||
            formValues.projects
                ?.map((t) => t.id)
                .sort()
                .join() !==
                actualFields.projects
                    ?.map((p) => p!.id)
                    .sort()
                    .join()
        ) {
            setFormChanged(true);
        }
    }, [formValues, actualFields]);

    const update = async (data: FormType) => {
        const promise = gql.mutation({
            updateTeam: [
                {
                    data: {
                        id: team.id,
                        title: data.title,
                        description: data.description,
                        projects: data.projects?.map((project) => project.id) || [],
                    },
                },
                {
                    title: true,
                    description: true,
                    projects: {
                        id: true,
                        title: true,
                    },
                },
            ],
        });

        toast.promise(promise, {
            error: tr('Something went wrong 😿'),
            loading: tr('We are updating team settings'),
            success: tr('Voila! Successfully updated 🎉'),
        });

        const res = await promise;

        // @ts-ignore
        res.updateTeam && setActualFields(res.updateTeam);
        setFormChanged(false);
    };

    const [deleteConfirmation, setDeleteConfirmation] = useState('');

    const onConfirmationInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setDeleteConfirmation(e.currentTarget.value);
    }, []);

    const onDeleteCancel = useCallback(() => {
        setDeleteConfirmation('');
        dispatchModalEvent(ModalEvent.TeamDeleteModal)();
    }, []);

    const deleteTeam = useCallback(async () => {
        const promise = gql.mutation({
            deleteTeam: [
                {
                    data: {
                        id: team.id,
                    },
                },
                {
                    id: true,
                },
            ],
        });

        toast.promise(promise, {
            error: tr('Something went wrong 😿'),
            loading: tr('We are deleting team'),
            success: tr('Successfully deleted 🎉'),
        });

        await promise;

        router.exploreTeams();
    }, [router, team]);

    const teamProjectsIds = formValues.projects?.map((project) => project!.id) ?? [];
    const [projectsQuery, setProjectsQuery] = useState('');
    const { data: projects } = useSWR(projectsQuery, (q) => projectsFetcher(user, q));

    const pageTitle = tr
        .raw('title', {
            team: team.title,
        })
        .join('');

    return (
        <Page user={user} locale={locale} ssrTime={ssrTime} title={pageTitle}>
            <TeamPageLayout team={team}>
                <PageSep />

                <SettingsContent>
                    <SettingsCard>
                        <Form onSubmit={handleSubmit(update)}>
                            <Fieldset title={tr('General')}>
                                <FormInput
                                    {...register('title')}
                                    label={tr('Title')}
                                    autoComplete="off"
                                    flat="bottom"
                                    error={formState.isSubmitted ? formState.errors.title : undefined}
                                />

                                <FormInput
                                    {...register('description')}
                                    label={tr('Description')}
                                    flat="both"
                                    error={formState.isSubmitted ? formState.errors.description : undefined}
                                />

                                <Controller
                                    name="projects"
                                    control={control}
                                    render={({ field }) => (
                                        <FormMultiInput
                                            label={tr('Projects')}
                                            query={projectsQuery}
                                            items={projects?.projectCompletion?.filter(
                                                (p) => !teamProjectsIds.includes(p.id),
                                            )}
                                            onInput={(q) => setProjectsQuery(q)}
                                            {...field}
                                        />
                                    )}
                                />
                            </Fieldset>

                            <FormActions flat="top">
                                <FormAction left />
                                <FormAction right inline>
                                    <Button
                                        size="m"
                                        view="primary"
                                        type="submit"
                                        disabled={!formChanged}
                                        text={tr('Save')}
                                    />
                                </FormAction>
                            </FormActions>
                        </Form>
                    </SettingsCard>

                    <SettingsCard view="warning">
                        <Form>
                            <Fieldset title={tr('Danger zone')} view="warning">
                                <FormActions flat="top">
                                    <FormAction left>
                                        <Text color={gray9} style={{ paddingLeft: gapS }}>
                                            {tr('Be careful! All data will be lost')}
                                        </Text>
                                    </FormAction>
                                    <FormAction right inline>
                                        <Button
                                            onClick={dispatchModalEvent(ModalEvent.TeamDeleteModal)}
                                            size="m"
                                            view="warning"
                                            text={tr('Delete team')}
                                        />
                                    </FormAction>
                                </FormActions>
                            </Fieldset>
                        </Form>
                    </SettingsCard>
                </SettingsContent>

                <ModalOnEvent view="warn" event={ModalEvent.TeamDeleteModal}>
                    <ModalHeader>
                        <FormTitle color={warn0}>{tr('You are trying to delete team')}</FormTitle>
                    </ModalHeader>

                    <ModalContent>
                        <Text>
                            {tr.raw('To confirm deleting team {team} please type team key below.', {
                                team: <b key={team.title}>{team.title}</b>,
                            })}
                        </Text>

                        <br />

                        <Form>
                            <FormInput
                                flat="bottom"
                                placeholder={team.key}
                                autoComplete="off"
                                onChange={onConfirmationInputChange}
                            />

                            <FormActions flat="top">
                                <FormAction left />
                                <FormAction right inline>
                                    <Button size="m" text={tr('Cancel')} onClick={onDeleteCancel} />
                                    <Button
                                        size="m"
                                        view="warning"
                                        disabled={deleteConfirmation !== team.key}
                                        onClick={deleteTeam}
                                        text={tr('Yes, delete it')}
                                    />
                                </FormAction>
                            </FormActions>
                        </Form>
                    </ModalContent>
                </ModalOnEvent>
            </TeamPageLayout>
        </Page>
    );
};