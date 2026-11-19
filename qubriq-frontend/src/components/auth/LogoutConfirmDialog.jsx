export default function LogoutConfirmDialog({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return <div className="dialog-backdrop" role="presentation"><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title"><h2 id="logout-title">Log out of Qubriq?</h2><div className="dialog__actions"><button className="btn btn--outline" onClick={onCancel}>Cancel</button><button className="btn btn--primary" onClick={onConfirm}>Log out</button></div></section></div>;
}
