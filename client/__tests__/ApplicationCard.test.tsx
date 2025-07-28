// client/src/components/ApplicationCard.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ApplicationCard from './ApplicationCard';

// Mock Image component from next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...rest }) {
    return <img src={src} alt={alt} {...rest} />;
  };
});

// Sample application data
const mockApplication = {
  property: {
    name: 'Sample Property',
    location: { city: 'Sample City', country: 'Sample Country' },
    pricePerMonth: 1200,
    photoUrls: ['sample-photo.jpg'],
  },
  status: 'Approved',
  lease: {
    startDate: '2023-01-01',
    endDate: '2024-01-01',
    nextPaymentDate: '2023-02-01',
  },
  tenant: { name: 'John Doe', phoneNumber: '1234567890', email: 'john@example.com' },
  manager: { name: 'Jane Smith', phoneNumber: '0987654321', email: 'jane@example.com' },
};

describe('ApplicationCard', () => {
  it('renders application details correctly for a manager', () => {
    render(<ApplicationCard application={mockApplication} userType="manager" />);

    expect(screen.getByText('Sample Property')).toBeInTheDocument();
    expect(screen.getByText('Sample City, Sample Country')).toBeInTheDocument();
    expect(screen.getByText('$1200')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Start Date:')).toBeInTheDocument();
    expect(screen.getByText('End Date:')).toBeInTheDocument();
    expect(screen.getByText('Next Payment:')).toBeInTheDocument();
    expect(screen.getByText('Tenant')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders application details correctly for a tenant', () => {
    render(<ApplicationCard application={mockApplication} userType="tenant" />);

    expect(screen.getByText('Sample Property')).toBeInTheDocument();
    expect(screen.getByText('Sample City, Sample Country')).toBeInTheDocument();
    expect(screen.getByText('$1200')).toBeInTheDocument();
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Start Date:')).toBeInTheDocument();
    expect(screen.getByText('End Date:')).toBeInTheDocument();
    expect(screen.getByText('Next Payment:')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('0987654321')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('handles image loading errors', () => {
    render(<ApplicationCard application={{ ...mockApplication, property: { ...mockApplication.property, photoUrls: [undefined] } }} userType="manager" />);

    const image = screen.getByAltText('Sample Property');
    fireEvent.error(image); // Trigger the error event

    expect(image.src).toContain('/placeholder.jpg'); // Check if placeholder image is shown
  });

  it('displays correct status color based on application status', () => {
    const { rerender } = render(<ApplicationCard application={{ ...mockApplication, status: 'Approved' }} userType="manager" />);
    expect(screen.getByText('Approved').parentElement).toHaveClass('bg-green-500');

    rerender(<ApplicationCard application={{ ...mockApplication, status: 'Denied' }} userType="manager" />);
    expect(screen.getByText('Denied').parentElement).toHaveClass('bg-red-500');

    rerender(<ApplicationCard application={{ ...mockApplication, status: 'Pending' }} userType="manager" />);
    expect(screen.getByText('Pending').parentElement).toHaveClass('bg-yellow-500');
  });

  it('formats lease dates correctly', () => {
    render(<ApplicationCard application={mockApplication} userType="manager" />);

    expect(screen.getByText('Start Date:')).toHaveTextContent('01/01/2023');
    expect(screen.getByText('End Date:')).toHaveTextContent('01/01/2024');
    expect(screen.getByText('Next Payment:')).toHaveTextContent('01/02/2023');
  });

  it('renders children components correctly', () => {
    render(
      <ApplicationCard application={mockApplication} userType="manager">
        <div>Additional Info</div>
      </ApplicationCard>
    );

    expect(screen.getByText('Additional Info')).toBeInTheDocument();
  });
});