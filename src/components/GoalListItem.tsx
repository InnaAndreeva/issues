import { MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { routes } from '../hooks/router';
import type { Scalars, State, Tag, Activity } from '../../graphql/@generated/genql';
import { gray4, textColor, gray10, gapM, gapS } from '../design/@generated/themes';
import { nullable } from '../utils/nullable';
import { TLocale } from '../types/locale';

import { Text } from './Text';
import { Tag as TagItem } from './Tag';
import { Icon } from './Icon';
import { UserPic } from './UserPic';
import { StateDot } from './StateDot';

const RelativeTime = dynamic(() => import('./RelativeTime'));

interface GoalListItemProps {
    id: string;
    title: string;
    locale: TLocale;
    issuer?: Activity;
    tags?: Array<Tag | undefined>;
    state?: State;
    createdAt: Scalars['DateTime'];
    owner?: Activity;
    comments?: number;
    hasForks?: boolean;
    isNotViewed?: boolean;
    focused?: boolean;

    onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const StyledGoal = styled.a<{ focused?: boolean }>`
    display: grid;
    grid-template-columns: 15px 30px 600px repeat(3, 40px);
    align-items: center;

    color: ${textColor};
    text-decoration: none;

    transition: background-color 150ms ease-in;

    &:hover {
        background-color: ${gray4};
    }

    &:visited {
        color: ${textColor};
    }

    ${({ focused }) =>
        focused &&
        css`
            background-color: ${gray4};
        `}

    padding: ${gapM} 20px;
    margin: 0 -20px;
`;

const StyledState = styled.div`
    align-self: start;
    justify-self: center;

    padding-top: 5px;
`;

const StyledNotViewed = styled.div`
    align-self: start;
    justify-self: center;
`;

const StyledNotViewedDot = styled.div`
    width: 5px;
    height: 5px;

    background-color: ${textColor};

    border-radius: 100%;
`;

const StyledName = styled.div`
    width: 800px;
    max-width: 100%;
    display: flex;
    flex-wrap: wrap;
`;

const StyledTitle = styled(Text)`
    margin-right: ${gapS};
`;

const StyledAddon = styled.div`
    justify-self: center;
    align-self: center;
    vertical-align: middle;
`;

const StyledCommentsCount = styled(Text)`
    display: inline-block;
    margin-left: ${gapS};
    vertical-align: top;
`;

const StyledSubTitle = styled(Text)`
    color: ${gray10};
    width: 100%;
    padding-top: ${gapS};
`;

const StyledTags = styled.div`
    padding-top: 1px;
`;

const StyledTag = styled(TagItem)`
    margin-right: ${gapS};
`;

const StyledIcon = styled(Icon)`
    vertical-align: middle;
`;

export const GoalListItem: React.FC<GoalListItemProps> = ({
    id,
    owner,
    issuer,
    createdAt,
    tags,
    title,
    comments,
    hasForks,
    isNotViewed,
    state,
    locale,
    focused,
    onClick,
}) => {
    const t = useTranslations('goals.item');

    return (
        <Link href={routes.goal(id)} passHref>
            <StyledGoal focused={focused} onClick={onClick}>
                <StyledNotViewed>{isNotViewed && <StyledNotViewedDot />}</StyledNotViewed>
                <StyledState>
                    {nullable(state, (s) => (
                        <StateDot size="m" hue={s.hue} />
                    ))}
                </StyledState>

                <StyledName>
                    <StyledTitle size="m" weight="bold">
                        {' '}
                        {title}
                    </StyledTitle>

                    <StyledTags>
                        {tags?.map((tag) =>
                            nullable(tag, (t) => <StyledTag key={t.id} title={t.title} description={t.description} />),
                        )}
                    </StyledTags>

                    <StyledSubTitle size="s">
                        #{id} <RelativeTime locale={locale} date={createdAt} kind="created" />
                        {`  ${t('by')} ${issuer?.user?.name}`}
                    </StyledSubTitle>
                </StyledName>

                <StyledAddon>
                    <UserPic src={owner?.user?.image} email={owner?.user?.email || owner?.ghost?.email} size={24} />
                </StyledAddon>

                <StyledAddon>{hasForks && <Icon type="gitFork" size="s" />}</StyledAddon>

                <StyledAddon>
                    {comments !== 0 && (
                        <>
                            <StyledIcon type="message" size="s" />
                            <StyledCommentsCount size="xs" weight="bold">
                                {comments}
                            </StyledCommentsCount>
                        </>
                    )}
                </StyledAddon>
            </StyledGoal>
        </Link>
    );
};