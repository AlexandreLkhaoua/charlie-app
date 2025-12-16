import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

describe('Card', () => {
  it('should render correctly', () => {
    render(<Card data-testid="card">Card content</Card>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply base classes', () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('rounded-xl');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-card');
    expect(card).toHaveClass('shadow-sm');
  });

  it('should merge custom className', () => {
    render(<Card data-testid="card" className="custom-class">Content</Card>);
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });

  it('should forward ref', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('CardHeader', () => {
  it('should render correctly', () => {
    render(<CardHeader data-testid="header">Header content</CardHeader>);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('should apply flex and padding classes', () => {
    render(<CardHeader data-testid="header">Content</CardHeader>);
    const header = screen.getByTestId('header');
    expect(header).toHaveClass('flex');
    expect(header).toHaveClass('flex-col');
    expect(header).toHaveClass('p-6');
  });
});

describe('CardTitle', () => {
  it('should render as h3', () => {
    render(<CardTitle>My Title</CardTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('should apply typography classes', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    const title = screen.getByTestId('title');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('tracking-tight');
  });
});

describe('CardDescription', () => {
  it('should render correctly', () => {
    render(<CardDescription>Description text</CardDescription>);
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('should apply muted-foreground class', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>);
    expect(screen.getByTestId('desc')).toHaveClass('text-muted-foreground');
  });
});

describe('CardContent', () => {
  it('should render correctly', () => {
    render(<CardContent data-testid="content">Main content</CardContent>);
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });

  it('should apply padding classes', () => {
    render(<CardContent data-testid="content">Content</CardContent>);
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('p-6');
    expect(content).toHaveClass('pt-0');
  });
});

describe('CardFooter', () => {
  it('should render correctly', () => {
    render(<CardFooter data-testid="footer">Footer content</CardFooter>);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('should apply flex classes', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    expect(screen.getByTestId('footer')).toHaveClass('flex');
  });
});

describe('Card composition', () => {
  it('should render a complete card with all parts', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
          <CardDescription>Your current holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Total Value: €100,000</p>
        </CardContent>
        <CardFooter>
          <button>View Details</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Portfolio Overview' })).toBeInTheDocument();
    expect(screen.getByText('Your current holdings')).toBeInTheDocument();
    expect(screen.getByText('Total Value: €100,000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Details' })).toBeInTheDocument();
  });
});
