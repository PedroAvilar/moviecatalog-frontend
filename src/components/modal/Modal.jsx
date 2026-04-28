import './modal.css';

function Modal({ isOpen, onClose, title, children }) {
	if (!isOpen) return null;

	return (
		<div
			className="modal-overlay"
			onClick={(e) => {
				if (e.target === e.currentTarget) {
					onClose();
				}
			}}
		>
			<div className="modal-content">
				<div className="modal-header">
					<h2>{title}</h2>
					<button className="modal-close" onClick={onClose}>
						&times;
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
}

export default Modal;
