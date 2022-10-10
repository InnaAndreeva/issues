import { arg, nonNull, stringArg } from 'nexus';
import { ObjectDefinitionBlock } from 'nexus/dist/core';

import { SortOrder, Project, computeUserFields, withComputedField, Goal, ProjectGoalsInput } from '../types';

export const query = (t: ObjectDefinitionBlock<'Query'>) => {
    t.field('project', {
        type: Project,
        args: {
            key: nonNull(stringArg()),
        },
        resolve: async (_, { key }, { db, activity }) => {
            if (!activity) return null;

            const project = await db.project.findUnique({
                where: {
                    key,
                },
                include: {
                    flow: true,
                    activity: {
                        ...computeUserFields,
                    },
                },
            });

            if (!project) return null;

            return withComputedField('activity')(project);
        },
    });

    t.list.field('projectGoals', {
        type: Goal,
        args: {
            projectGoals: nonNull(arg({ type: ProjectGoalsInput })),
        },
        resolve: async (_, { projectGoals }, { db, activity }) => {
            if (!activity) return null;

            const stateFilter = projectGoals.states.length
                ? {
                      state: {
                          id: {
                              in: projectGoals.states,
                          },
                      },
                  }
                : {};

            const goals = await db.goal.findMany({
                take: projectGoals.pageSize,
                skip: projectGoals.offset,
                where: {
                    OR: [
                        {
                            title: {
                                contains: projectGoals.query,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: projectGoals.query,
                                mode: 'insensitive',
                            },
                        },
                    ],
                    project: {
                        key: projectGoals.key,
                    },
                    ...stateFilter,
                },
                include: {
                    owner: {
                        ...computeUserFields,
                    },
                    activity: {
                        ...computeUserFields,
                    },
                    tags: true,
                    state: true,
                    project: true,
                    estimate: true,
                    dependsOn: {
                        include: {
                            state: true,
                        },
                    },
                    relatedTo: {
                        include: {
                            state: true,
                        },
                    },
                    blocks: {
                        include: {
                            state: true,
                        },
                    },
                    comments: true,
                },
            });

            return goals.map(withComputedField('owner', 'activity'));
        },
    });

    t.list.field('projectCompletion', {
        type: Project,
        args: {
            sortBy: arg({ type: SortOrder }),
            query: nonNull(stringArg()),
        },
        // eslint-disable-next-line no-shadow
        resolve: async (_, { sortBy, query }, { db }) => {
            if (query === '') {
                return [];
            }

            return db.project.findMany({
                orderBy: { createdAt: sortBy || undefined },
                where: {
                    title: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                include: {
                    activity: {
                        include: {
                            user: true,
                        },
                    },
                    flow: {
                        include: {
                            states: true,
                        },
                    },
                },
            });
        },
    });
};

export const mutation = (t: ObjectDefinitionBlock<'Mutation'>) => {
    t.field('createProject', {
        type: Project,
        args: {
            key: nonNull(stringArg()),
            title: nonNull(stringArg()),
            description: stringArg(),
            flowId: nonNull(stringArg()),
        },
        resolve: async (_, { key, title, description, flowId }, { db, activity }) => {
            if (!activity) return null;

            try {
                return db.project.create({
                    data: {
                        key,
                        title,
                        description,
                        activityId: activity.id,
                        flowId,
                    },
                });

                // await mailServer.sendMail({
                //     from: `"Fred Foo 👻" <${process.env.MAIL_USER}>`,
                //     to: 'bar@example.com, baz@example.com',
                //     subject: 'Hello ✔',
                //     text: `new post '${title}'`,
                //     html: `new post <b>${title}</b>`,
                // });
            } catch (error) {
                throw Error(`${error}`);
            }
        },
    });
};
