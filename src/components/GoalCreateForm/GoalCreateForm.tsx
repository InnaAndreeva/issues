import { useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { gapS, gray6, gray10 } from '@taskany/colors';
import { BulbOnIcon, Link, QuestionIcon } from '@taskany/bricks';

import { gql } from '../../utils/gql';
import { Activity } from '../../../graphql/@generated/genql';
import { routes, useRouter } from '../../hooks/router';
import { usePageContext } from '../../hooks/usePageContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { dispatchModalEvent, ModalEvent } from '../../utils/dispatchModal';
import { Tip } from '../Tip';
import { Keyboard } from '../Keyboard';
import { GoalForm, GoalFormType } from '../GoalForm/GoalForm';

import { tr } from './GoalCreateForm.i18n';

const StyledFormBottom = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    padding: ${gapS} ${gapS} 0 ${gapS};
`;

const GoalCreateForm: React.FC = () => {
    const router = useRouter();
    const { locale, user } = usePageContext();
    const [lastProjectCache, setLastProjectCache] = useLocalStorage('lastProjectCache');
    const [currentProjectCache] = useLocalStorage('currentProjectCache');
    const [recentProjectsCache, setRecentProjectsCache] = useLocalStorage('recentProjectsCache', {});
    const [busy, setBusy] = useState(false);

    const createGoal = async (form: GoalFormType) => {
        setBusy(true);

        const promise = gql.mutation({
            createGoal: [
                {
                    data: {
                        title: form.title,
                        description: form.description,
                        ownerId: form.owner.id,
                        projectId: form.parent.id,
                        stateId: form.state.id,
                        priority: form.priority,
                        tags: form.tags,
                        estimate: form.estimate,
                    },
                },
                {
                    id: true,
                },
            ],
        });

        toast.promise(promise, {
            error: tr('Something went wrong 😿'),
            loading: tr('We are creating new goal'),
            success: tr('Voila! Goal is here 🎉'),
        });

        const res = await promise;

        if (res?.createGoal?.id) {
            const newRecentProjectsCache = { ...recentProjectsCache };
            if (newRecentProjectsCache[form.parent.id]) {
                newRecentProjectsCache[form.parent.id].rate += 1;
            } else {
                newRecentProjectsCache[form.parent.id] = {
                    rate: 1,
                    cache: form.parent,
                };
            }

            setRecentProjectsCache(newRecentProjectsCache);
            setLastProjectCache(form.parent);

            router.goal(res.createGoal.id);
            dispatchModalEvent(ModalEvent.GoalCreateModal)();
        }
    };

    return (
        <GoalForm
            busy={busy}
            formTitle={tr('New goal')}
            owner={{ id: user?.activityId, user } as Partial<Activity>}
            parent={currentProjectCache || lastProjectCache || undefined}
            priority="Medium"
            onSumbit={createGoal}
            actionBtnText={tr('Create goal')}
        >
            <StyledFormBottom>
                <Tip title={tr('Pro tip!')} icon={<BulbOnIcon size="s" color={gray10} />}>
                    {tr.raw('Press key to create the goal', {
                        key: <Keyboard command enter />,
                    })}
                </Tip>

                <Link href={routes.help(locale, 'goals')}>
                    <QuestionIcon size="s" color={gray6} />
                </Link>
            </StyledFormBottom>
        </GoalForm>
    );
};

export default GoalCreateForm;