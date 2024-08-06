function Popup(props) {
  return (
    <div className="popup-bg">
        <div className="popup">{props.children}</div>
    </div>
  )
}

export default Popup