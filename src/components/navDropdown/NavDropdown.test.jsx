import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import NavDropdown from './NavDropdown';

describe('NavDropdown Component (Unit Tests)', () => {
	const mockOnToggle = vi.fn();

	const mockOnCloseMenu = vi.fn();

	const mockItems = [
		{ label: 'Link 1', to: '/link1' },
		{ label: 'Botão Ação', type: 'button', onClick: vi.fn() },
	];

	const renderDropdown = (isOpen = false) => {
		return render(
			<MemoryRouter>
				<NavDropdown
					label="Meu Menu"
					items={mockItems}
					isOpen={isOpen}
					onToggle={mockOnToggle}
					onCloseMenu={mockOnCloseMenu}
				/>
			</MemoryRouter>,
		);
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('Deve renderizar o label do dropdown corretamente', () => {
		renderDropdown();

		expect(screen.getByText(/meu menu/i)).toBeInTheDocument();
	});

	it('Deve chamar onToggle ao clicar no botão em dispositivos mobile', async () => {
		window.innerWidth = 500;
		const user = userEvent.setup();
		renderDropdown(false);
		const button = screen.getByRole('button', { name: /meu menu/i });
		await user.click(button);

		expect(mockOnToggle).toHaveBeenCalledWith(true);
	});

	it('Não deve chamar onToggle ao clicar no botão em desktop', async () => {
		window.innerWidth = 1024;
		const user = userEvent.setup({ skipHover: true });
		renderDropdown(false);
		const button = screen.getByRole('button', { name: /meu menu/i });
		await user.click(button);

		expect(mockOnToggle).not.toHaveBeenCalled();
	});

	it('Deve disparar onToggle(true) no MouseEnter em desktop', () => {
		window.innerWidth = 1024;
		const { container } = renderDropdown(false);
		const li = container.querySelector('.nav-dropdown');
		fireEvent.mouseEnter(li);

		expect(mockOnToggle).toHaveBeenCalledWith(true);
	});

	it('Deve disparar onToggle(false) no MouseLeave em desktop', () => {
		window.innerWidth = 1024;
		const { container } = renderDropdown(true);
		const li = container.querySelector('.nav-dropdown');
		fireEvent.mouseLeave(li);

		expect(mockOnToggle).toHaveBeenCalledWith(false);
	});

	it('Deve chamar onCloseMenu ao clicar em um link (NavLink)', async () => {
		const user = userEvent.setup();
		renderDropdown(true);
		const link = screen.getByText('Link 1');
		await user.click(link);

		expect(mockOnCloseMenu).toHaveBeenCalledTimes(1);
	});

	it('Deve chamar a função do item e onCloseMenu ao clicar em um item do tipo button', async () => {
		const user = userEvent.setup();
		renderDropdown(true);
		const actionButton = screen.getByText('Botão Ação');
		await user.click(actionButton);

		expect(mockItems[1].onClick).toHaveBeenCalledTimes(1);
		expect(mockOnCloseMenu).toHaveBeenCalledTimes(1);
	});
});
