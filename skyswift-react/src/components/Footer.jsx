export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} SkySwift Airlines</span>
        <span className="muted">Demo UI for project</span>
      </div>
    </footer>
  )
}
