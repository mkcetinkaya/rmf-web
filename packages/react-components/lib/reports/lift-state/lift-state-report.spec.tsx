import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TestLocalizationProvider } from '../../test/locale';
import { getLiftLogs, reportConfigProps } from '../utils.spec';
import { LiftStateReport } from './lift-state-report';

const getLogsPromise = async () => getLiftLogs();

it('smoke test', async () => {
  await waitFor(() => {
    render(<LiftStateReport getLogs={getLogsPromise} />);
  });
});

it('doesn`t shows the table when logs list is empty', async () => {
  await waitFor(() => {
    render(<LiftStateReport getLogs={async () => []} />);
  });

  expect(screen.queryByText('Lift State')).toBeFalsy();
});

it('calls the retrieve log function when the button is clicked', async () => {
  const getLogsPromiseMock = jasmine.createSpy();
  const getLogsPromise = async () => {
    getLogsPromiseMock();
    return getLiftLogs();
  };
  render(<LiftStateReport getLogs={getLogsPromise} {...reportConfigProps} />, {
    wrapper: TestLocalizationProvider,
  });
  expect(screen.getByRole('button', { name: /Retrieve Logs/i })).toBeTruthy();
  userEvent.click(screen.getByRole('button', { name: /Retrieve Logs/i }));
  expect(getLogsPromiseMock).toHaveBeenCalled();
});
