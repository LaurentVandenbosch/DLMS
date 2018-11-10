import React from 'react';

export default function Messages(props) {
    return (
        <ul>
            {
                props.messages.map(m => 
                    <li key={m._id}>{m._id}</li>  
                )
            }
        </ul>
    );
}