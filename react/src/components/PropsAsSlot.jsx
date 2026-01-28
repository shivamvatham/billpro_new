function PropsAsSlot(props) {
    console.log(props)
    return (
        <div style={{color: props.color, backgroundColor: 'pink'}}>
            {props.children}
        </div>
    )
}

export default PropsAsSlot;