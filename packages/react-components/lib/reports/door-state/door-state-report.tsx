import React from 'react';
import {
  DefaultReportQueryPayload,
  defaultReportClasses,
  DefaultReportContainer,
} from '../default-report-interface';
import { DefaultDatesForm } from '../default-dates-form';
import { DoorStateReportTable, DoorStateRowsType } from './door-state-report-table';
import { ReportConfigProps } from '../utils';

export interface DoorStateReportProps extends ReportConfigProps {
  getLogs: (data: DefaultReportQueryPayload) => Promise<DoorStateRowsType>;
}

export const DoorStateReport = (props: DoorStateReportProps): React.ReactElement => {
  const { getLogs, ...otherProps } = props;
  const [logs, setLogs] = React.useState<DoorStateRowsType>([]);
  const [lastSearchParams, setLastSearchParams] = React.useState<DefaultReportQueryPayload>({});

  const searchLogs = async (payload: DefaultReportQueryPayload) => {
    setLastSearchParams(payload);
    setLogs(await getLogs(payload));
  };

  const getMoreLogs = async () => {
    setLogs(logs.concat(await getLogs({ ...lastSearchParams, offset: logs.length })));
  };

  return (
    <DefaultReportContainer>
      <DefaultDatesForm search={searchLogs} {...otherProps} />
      <div className={defaultReportClasses.table}>
        {logs.length !== 0 && (
          <DoorStateReportTable rows={logs} tableSize={500} addMoreRows={getMoreLogs} />
        )}
      </div>
    </DefaultReportContainer>
  );
};

export default DoorStateReport;
