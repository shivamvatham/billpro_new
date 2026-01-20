function PropsAsSlot({ children, color = 'green' }) {
    return (
        <div style={{color: color, backgroundColor: 'pink'}}>
            {children}
        </div>
    )
}

export default PropsAsSlot;