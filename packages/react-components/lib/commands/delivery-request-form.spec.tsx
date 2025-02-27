import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { DeliveryRequestForm } from './delivery-request-form';
import { availableDispensers, availablePlaces, fleets } from './test-data.spec';

describe('Form validation', () => {
  let fakeDoDeliveryRequest: ReturnType<typeof jasmine.createSpy>;
  let root: ReturnType<typeof renderForm>;

  function renderForm() {
    fakeDoDeliveryRequest = jasmine.createSpy();

    return render(
      <DeliveryRequestForm
        fleetNames={fleets}
        availablePlaces={availablePlaces}
        availableDispensers={availableDispensers}
        doDeliveryRequest={fakeDoDeliveryRequest}
      />,
    );
  }

  function prepareValidForm() {
    userEvent.click(root.getByPlaceholderText('Pickup Dispenser'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('dispenserA'));
    userEvent.click(root.getByPlaceholderText('Pick Drop Off Dispenser'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('dispenserB'));
  }

  beforeEach(() => {
    root = renderForm();
    prepareValidForm();
  });

  it('Successful Request', () => {
    userEvent.click(root.getByText('Request'));
    expect(fakeDoDeliveryRequest).toHaveBeenCalled();
  });

  it('Pickup dispenser cannot be empty', () => {
    userEvent.type(root.getByPlaceholderText('Pickup Dispenser'), '{selectall}{backspace}');

    userEvent.click(root.getByText('Request'));
    expect(root.container.querySelector('.MuiFormHelperText-root.Mui-error')).toBeTruthy();
    expect(fakeDoDeliveryRequest).not.toHaveBeenCalled();
  });

  it('Dropoff dispenser cannot be empty', () => {
    userEvent.type(root.getByPlaceholderText('Pick Drop Off Dispenser'), '{selectall}{backspace}');

    userEvent.click(root.getByText('Request'));
    expect(root.container.querySelector('.MuiFormHelperText-root.Mui-error')).toBeTruthy();
    expect(fakeDoDeliveryRequest).not.toHaveBeenCalled();
  });

  it('Pickup place cannot be empty', () => {
    userEvent.type(root.getByPlaceholderText('Pick Start Location'), '{selectall}{backspace}');

    userEvent.click(root.getByText('Request'));
    expect(root.container.querySelector('.MuiFormHelperText-root.Mui-error')).toBeTruthy();
    expect(fakeDoDeliveryRequest).not.toHaveBeenCalled();
  });

  it('Dropoff place cannot be empty', () => {
    userEvent.type(root.getByPlaceholderText('Pick Drop Off Location'), '{selectall}{backspace}');

    expect(root.container.querySelector('.MuiFormHelperText-root.Mui-error')).toBeTruthy();
    userEvent.click(root.getByText('Request'));
    expect(fakeDoDeliveryRequest).not.toHaveBeenCalled();
  });

  it('shows error when a place with no dispenser is picked', async () => {
    userEvent.click(root.getByPlaceholderText('Choose Target Fleet'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('fleetB'));

    userEvent.click(root.getByPlaceholderText('Pick Start Location'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('placeB'));

    userEvent.click(root.getByPlaceholderText('Pickup Dispenser'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('dispenserB'));

    userEvent.click(root.getByPlaceholderText('Pick Drop Off Location'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('placeC'));

    expect(
      await waitFor(() => {
        if (!root.container.querySelector('.MuiFormHelperText-root.Mui-error')) {
          throw '';
        }
        return true;
      }),
    ).toBe(true);
  });

  it('Pickup dispenser cannot be equal to dropoff dispenser', () => {
    userEvent.click(root.getByPlaceholderText('Pick Drop Off Location'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('placeA'));
    userEvent.click(root.getByPlaceholderText('Pick Drop Off Dispenser'));
    userEvent.click(within(screen.getByRole('listbox')).getByText('dispenserA'));
    userEvent.click(root.getByText('Request'));

    expect(root.container.querySelector('.MuiFormHelperText-root.Mui-error')).toBeTruthy();
    expect(fakeDoDeliveryRequest).not.toHaveBeenCalled();
  });
});
