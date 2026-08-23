import React from 'react'

const Whatsapp = ({onClose}) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"  onClick={onClose}>Whatsapp</div>
  )
}

export default Whatsapp