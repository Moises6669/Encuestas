import React from 'react'

const Input = ({ require, name, place, styles, key, secondary }) => {
    return(
        <input 
        name={ name }
        type="text"
        placeholder={ place }
        className={ styles }
        ref={ require }
        key={ key }
        disabled={ secondary === "true" ? true : null }
    />
    )
}

export default Input