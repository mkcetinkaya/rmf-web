import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { WorkcellMarker } from './workcell-marker';

describe('WorkcellMarker', () => {
  it('triggers onClick callback when button is clicked', () => {
    const mockOnClick = jasmine.createSpy();

    const root = render(
      <svg>
        <WorkcellMarker cx={0} cy={0} size={1} onClick={mockOnClick} data-testid="marker" />
      </svg>,
    );
    userEvent.click(root.getByTestId('marker'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('smoke test - marker with image icon', () => {
    render(
      <svg>
        <WorkcellMarker cx={0} cy={0} size={1} iconPath="/base/test-data/assets/ros-health.png" />
      </svg>,
    );
  });
});
