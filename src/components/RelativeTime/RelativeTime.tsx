import { useEffect, useState } from 'react';
import { useMounted } from '@taskany/bricks';

import { dateAgo, createLocaleDate, parseLocaleDate } from '../../utils/dateTime';
import { usePageContext } from '../../hooks/usePageContext';
import { Light } from '../Light';

import { tr } from './RelativeTime.i18n';

type RelativeTimeKindCommon = 'created' | 'updated';
type RelativeTimeKind = RelativeTimeKindCommon | Capitalize<RelativeTimeKindCommon>;

interface RelativeTimeProps {
    date: string;
    kind?: RelativeTimeKind;
}

const map: Record<RelativeTimeKind, string> = {
    created: tr('created'),
    updated: tr('updated'),
    Created: tr('Created'),
    Updated: tr('Updated'),
};

const RelativeTime: React.FC<RelativeTimeProps> = ({ kind, date }) => {
    const { locale, ssrTime } = usePageContext();
    const [time, setTime] = useState(ssrTime);
    const mounted = useMounted(0);
    const localeDate = parseLocaleDate(date, { locale });

    useEffect(() => {
        setTime(Date.now());
    }, [mounted]);

    useEffect(() => {
        setTimeout(() => {
            setTime(Date.now());
        }, 100); // TODO: use a better interval?
    }, []);

    return (
        <>
            {kind ? `${map[kind]} ` : ''}
            <Light title={createLocaleDate(localeDate, { locale })}>{dateAgo(localeDate, time, { locale })}</Light>
        </>
    );
};

export default RelativeTime;