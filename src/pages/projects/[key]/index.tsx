import { useCallback, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import styled from 'styled-components';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { gapS } from '../../../design/@generated/themes';
import { Goal, Project } from '../../../../graphql/@generated/genql';
import { dispatchModalEvent, ModalEvent } from '../../../utils/dispatchModal';
import { createFetcher } from '../../../utils/createFetcher';
import { declareSsrProps, ExternalPageProps } from '../../../utils/declareSsrProps';
import { nullable } from '../../../utils/nullable';
import { routes } from '../../../hooks/router';
import { useMounted } from '../../../hooks/useMounted';
import { Page } from '../../../components/Page';
import { Button } from '../../../components/Button';
import { GoalItem } from '../../../components/GoalItem';
import { CommonHeader } from '../../../components/CommonHeader';
import { TabsMenu, TabsMenuItem } from '../../../components/TabsMenu';
import { ProjectWatchButton } from '../../../components/ProjectWatchButton';
import { ProjectStarButton } from '../../../components/ProjectStarButton';
import { FiltersPanel, defaultLimit } from '../../../components/FiltersPanel';

const refreshInterval = 3000;

const parseQueryParam = (param = '') => param.split(',').filter(Boolean);
// @ts-ignore
const fetcher = createFetcher(
    (_, key: string, offset = 0, states = [], query = '', limitFilter = defaultLimit, tags = [], owner = []) => ({
        project: [
            {
                key,
            },
            {
                id: true,
                key: true,
                title: true,
                description: true,
                activityId: true,
                flow: {
                    id: true,
                    states: {
                        id: true,
                        title: true,
                        hue: true,
                        default: true,
                    },
                },
                watchers: {
                    id: true,
                },
                stargizers: {
                    id: true,
                },
                tags: {
                    id: true,
                    title: true,
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
        projectGoals: [
            {
                data: {
                    key,
                    offset,
                    pageSize: limitFilter,
                    states,
                    tags,
                    owner,
                    query,
                },
            },
            {
                id: true,
                title: true,
                description: true,
                project: {
                    id: true,
                    title: true,
                },
                state: {
                    id: true,
                    title: true,
                    hue: true,
                },
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
                owner: {
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
                tags: {
                    id: true,
                    title: true,
                    description: true,
                },
                comments: {
                    id: true,
                },
                createdAt: true,
                updatedAt: true,
            },
        ],
        projectGoalsCount: [
            {
                data: {
                    key,
                    states,
                    tags,
                    owner,
                    query,
                },
            },
        ],
    }),
);

export const getServerSideProps = declareSsrProps(
    async ({ user, params: { key }, query }) => {
        return {
            ssrData: await fetcher(user, key, 0, parseQueryParam(query.stateFilter as string)),
        };
    },
    {
        private: true,
    },
);

const StyledGoalsList = styled.div`
    padding: 20px 20px 0 20px;
`;

const StyledLoadMore = styled.div`
    margin: 50px 40px;
`;

const StyledProjectActions = styled.div`
    justify-self: right;
    justify-items: end;

    align-content: space-between;

    > * + * {
        margin-left: ${gapS};
    }
`;

const ProjectPage = ({
    user,
    locale,
    ssrData,
    params: { key },
}: ExternalPageProps<{ project: Project; projectGoals: Goal[]; projectGoalsCount: number }, { key: string }>) => {
    const t = useTranslations('projects.key');
    const router = useRouter();
    const [fulltextFilter, setFulltextFilter] = useState('');
    const [stateFilter, setStateFilter] = useState<string[]>(parseQueryParam(router.query.stateFilter as string));
    const [tagsFilter, setTagsFilter] = useState<string[]>();
    const [ownerFilter, setOwnerFilter] = useState<string[]>();
    const [limitFilter, setLimitFilter] = useState(defaultLimit);

    const { data, setSize, size } = useSWRInfinite(
        (index: number) => ({
            offset: index * limitFilter,
            stateFilter,
            fulltextFilter,
            limitFilter,
            tagsFilter,
            ownerFilter,
        }),
        ({ offset, stateFilter, fulltextFilter, limitFilter, tagsFilter, ownerFilter }) =>
            fetcher(user, key, offset, stateFilter, fulltextFilter, limitFilter, tagsFilter, ownerFilter),
    );
    const shouldRenderMoreButton =
        (data?.[data.length - 1]?.projectGoals?.length || 0) === limitFilter &&
        (data?.[data.length - 1]?.projectGoals?.length || 0) * size < (data?.[0].projectGoalsCount || 0);

    const goals = fulltextFilter
        ? data?.map((chunk) => chunk.projectGoals).flat()
        : data?.map((chunk) => chunk.projectGoals).flat() ?? ssrData.projectGoals;
    const project = data?.[0].project ?? ssrData.project;
    const goalsCount = data?.[0].projectGoalsCount ?? ssrData.projectGoalsCount;

    const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFulltextFilter(e.currentTarget.value);
    }, []);

    const mounted = useMounted(refreshInterval);

    useEffect(() => {
        const stateParams = new URLSearchParams(window.location.search);
        const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        if (mounted) {
            if (stateFilter.length > 0) {
                stateParams.set('stateFilter', Array.from(stateFilter).toString());
                window.history.pushState({ path: `${newurl}?${stateParams}` }, '', `${newurl}?${stateParams}`);
            } else {
                window.history.pushState({ path: newurl }, '', newurl);
            }
        }
    }, [stateFilter, mounted]);

    return (
        <Page
            locale={locale}
            title={t.rich('title', {
                project: () => project.title,
            })}
        >
            <CommonHeader
                preTitle={`${t('key')}: ${project.key}`}
                title={project.title}
                description={project.description}
            >
                <StyledProjectActions>
                    <ProjectWatchButton
                        activityId={user.activityId}
                        projectId={project.id}
                        watchers={project.watchers}
                    />
                    <ProjectStarButton
                        activityId={user.activityId}
                        projectId={project.id}
                        stargizers={project.stargizers}
                    />
                </StyledProjectActions>

                <TabsMenu>
                    <TabsMenuItem active>Goals</TabsMenuItem>
                    <TabsMenuItem>Issues</TabsMenuItem>
                    <TabsMenuItem>Boards</TabsMenuItem>
                    <TabsMenuItem>Wiki</TabsMenuItem>

                    {nullable(user.activityId === project.activityId, () => (
                        <NextLink href={routes.projectSettings(key)} passHref>
                            <TabsMenuItem>Settings</TabsMenuItem>
                        </NextLink>
                    ))}
                </TabsMenu>
            </CommonHeader>

            <FiltersPanel
                count={goalsCount}
                flowId={project.flow?.id}
                users={project.participants}
                tags={project.tags}
                filters={stateFilter}
                onSearchChange={onSearchChange}
                onStateChange={setStateFilter}
                onUserChange={setOwnerFilter}
                onTagChange={setTagsFilter}
                onLimitChange={setLimitFilter}
            >
                <Button
                    view="primary"
                    size="m"
                    text={t('New goal')}
                    onClick={dispatchModalEvent(ModalEvent.GoalCreateModal, project)}
                />
            </FiltersPanel>

            <StyledGoalsList>
                {goals?.map((goal) =>
                    nullable(goal, (g) => (
                        <GoalItem
                            createdAt={g.createdAt}
                            id={g.id}
                            state={g.state}
                            title={g.title}
                            issuer={g.activity}
                            owner={g.owner}
                            tags={g.tags}
                            comments={g.comments?.length}
                            key={g.id}
                        />
                    )),
                )}

                <StyledLoadMore>
                    {shouldRenderMoreButton && <Button text={t('Load more')} onClick={() => setSize(size + 1)} />}
                </StyledLoadMore>
            </StyledGoalsList>
        </Page>
    );
};

export default ProjectPage;