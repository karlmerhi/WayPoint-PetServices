import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

// Mock MaterialIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

// Mock useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn().mockReturnValue('#0a7ea4'),
}));

describe('EmptyState', () => {
  it('renders with minimal props', () => {
    const { getByText } = render(
      <EmptyState title="No data" />
    );
    
    expect(getByText('No data')).toBeTruthy();
  });

  it('renders with message', () => {
    const { getByText } = render(
      <EmptyState 
        title="No data" 
        message="There is no data to display" 
      />
    );
    
    expect(getByText('No data')).toBeTruthy();
    expect(getByText('There is no data to display')).toBeTruthy();
  });

  it('renders with action button', () => {
    const onActionMock = jest.fn();
    const { getByText } = render(
      <EmptyState 
        title="No data" 
        actionLabel="Refresh" 
        onAction={onActionMock} 
      />
    );
    
    const button = getByText('Refresh');
    expect(button).toBeTruthy();
    
    fireEvent.press(button);
    expect(onActionMock).toHaveBeenCalledTimes(1);
  });

  it('does not render button when only actionLabel is provided', () => {
    const { queryByText } = render(
      <EmptyState 
        title="No data" 
        actionLabel="Refresh" 
      />
    );
    
    expect(queryByText('Refresh')).toBeNull();
  });

  it('does not render button when only onAction is provided', () => {
    const onActionMock = jest.fn();
    const { queryByText } = render(
      <EmptyState 
        title="No data" 
        onAction={onActionMock} 
      />
    );
    
    // Should not find any button since no actionLabel was provided
    expect(queryByText('Refresh')).toBeNull();
  });

  it('renders NoResults preset correctly', () => {
    const { getByText } = render(<EmptyState.NoResults />);
    
    expect(getByText('No results found')).toBeTruthy();
    expect(getByText('Try using different search terms or filters.')).toBeTruthy();
  });

  it('renders NoItems preset correctly', () => {
    const { getByText } = render(<EmptyState.NoItems />);
    
    expect(getByText('No items yet')).toBeTruthy();
    expect(getByText('Items you add will appear here.')).toBeTruthy();
  });

  it('renders Error preset correctly', () => {
    const { getByText } = render(<EmptyState.Error />);
    
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText("We couldn't load your data. Please try again.")).toBeTruthy();
    // Note: actionLabel is set but will only be shown when onAction is also provided
  });

  it('allows preset props to be overridden', () => {
    const customTitle = 'Custom Error Title';
    const { getByText } = render(<EmptyState.Error title={customTitle} />);
    
    expect(getByText(customTitle)).toBeTruthy();
    // Should still have the default message
    expect(getByText("We couldn't load your data. Please try again.")).toBeTruthy();
  });

  it('respects custom icon props', () => {
    const { UNSAFE_getAllByType } = render(
      <EmptyState 
        title="Custom Icon" 
        icon="star" 
        iconSize={48}
      />
    );
    
    // Get the MaterialIcons component
    const icons = UNSAFE_getAllByType('MaterialIcons');
    expect(icons.length).toBeGreaterThan(0);
    
    // Check if at least one icon has the correct props
    const hasStarIcon = icons.some(icon => 
      icon.props.name === 'star' && icon.props.size === 48
    );
    expect(hasStarIcon).toBeTruthy();
  });
}); 