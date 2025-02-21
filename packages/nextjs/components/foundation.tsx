import React from 'react'
import Link from 'next/link';

interface FoundationProps {
    id: string;
    [key: string]: any;
}

export const Foundation: React.FC<FoundationProps> = (props) => {
    console.log(props)
    return (
        <div className="flex flex-column align-items-center">
            <div>
                hfghfgh{props.id}
            </div>
        </div>
    )
}


