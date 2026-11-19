export default function RoleCard({ title, description, Icon, selected, onClick }) {
  return <button type="button" className={`role ${selected ? "role--selected" : ""}`} onClick={onClick}><span className="role__icon"><Icon aria-hidden="true" /></span><span className="role__title">{title}</span><span className="role__text">{description}</span></button>;
}
