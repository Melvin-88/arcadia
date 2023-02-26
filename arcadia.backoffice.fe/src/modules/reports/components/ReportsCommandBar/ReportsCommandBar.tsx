import React, { useCallback, useEffect, useMemo } from 'react';
import {
  BinaryBoolean,
  Button,
  ButtonColor,
  Form,
  FormSpy,
} from 'arcadia-common-fe';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ROUTES_MAP } from '../../../../routing/constants';
import { ReportsListField } from './ReportsListField/ReportsListField';
import { setProcessedReportsDialog } from '../../modules/processedReports/state/actions';
import { setReportType } from '../../state/actions';
import { ReportType } from '../../types';
import { PlayerStatsReportGroupingKeys } from '../ReportsGroupByField/types';
import { DisputesReportState } from '../../modules/disputes/components/DisputesReportFilters/DisputesReportState/DisputesReportState';
import './ReportsCommandBar.scss';

export const ReportsCommandBar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const history = useHistory();

  const initialValues = useMemo(() => ({
    report: pathname.split('/')[2],
  }), [pathname]);

  const handleFormSubmit = useCallback(({ report }: { report: ReportType }) => {
    if (report && pathname.indexOf(report) === -1) {
      switch (report) {
        case ReportType.playerStats:
          history.push(ROUTES_MAP.reports.createReportURL(report, { groupBy: PlayerStatsReportGroupingKeys.player }));
          break;
        case ReportType.disputes:
          history.push(ROUTES_MAP.reports.createReportURL(report, { filterByDate: DisputesReportState.close }));
          break;
        case ReportType.funnel:
          history.push(ROUTES_MAP.reports.createReportURL(report, { newPlayersOnly: BinaryBoolean.false }));
          break;
        default:
          history.push(ROUTES_MAP.reports.createReportURL(report));
          break;
      }
    }
  }, [pathname, history]);

  const handleSubmitForm = useCallback(({ values }) => {
    handleFormSubmit(values);
  }, [handleFormSubmit]);

  const handleGetProcessedReports = useCallback(() => {
    dispatch(setProcessedReportsDialog({ isOpen: true }));
  }, []);

  useEffect(() => {
    if (initialValues?.report) {
      dispatch(setReportType(initialValues.report));
    }
  }, [initialValues]);

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
      render={({ handleSubmit }) => (
        <form className="reports-command-bar" onSubmit={handleSubmit}>
          <FormSpy onChange={handleSubmitForm} />
          <div className="reports-command-bar__label">Report Select</div>
          <ReportsListField className="reports-command-bar__select" />
          <Button
            className="reports-command-bar__btn"
            color={ButtonColor.secondary}
            disabled={!initialValues.report}
            onClick={handleGetProcessedReports}
          >
            Processed reports
          </Button>
        </form>
      )}
    />
  );
};
