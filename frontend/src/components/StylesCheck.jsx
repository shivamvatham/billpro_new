import { useState } from "react"
import '../css/StyleCheck.css'
import styles from '../css/StyleCheck.module.css'

export function StylesCheck() {
    const [style, setStyle] = useState('red')

    const cardStyle = {
        width: '200px',
        padding: '10px',
        borderRadius: '20px',
        boxShadow: '2px 2px 2px 2px #aaa'
    }
    const user = [
        {
            name: 'Shivam Kashyap',
            deg: 'Frontend Software Devloper'
        },
        {
            name: 'Meet Patel',
            deg: 'Frontend Software Devloper'
        },
        {
            name: 'Jayesh Kapadiya',
            deg: 'Backend Laravel Devloper'
        },
        {
            name: 'Vishal shiyal',
            deg: 'Its a Chinal.....'
        },
        {
            name: 'Pritesh Patel',
            deg: 'CEO'
        },
        {
            name: 'Hitesh Bhakta',
            deg: 'Designer'
        },
    ]
    return (
        <div>
            <h2>Company Details</h2>
            <button onClick={()=> setStyle(style == 'green' ? 'red' : 'green')}>change colors</button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent:'center' }}>
                {
                    user.map((user, index) => (
                        <div key={index} style={cardStyle} className="test">
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <img style={{ height: '150px', width: '150px', objectFit: 'cover', borderRadius: '20%' }} src="https://icon-library.com/images/generic-user-icon/generic-user-icon-9.jpg" alt="user img" />

                            </div>
                            <div>
                                <h3 className={styles.test}>{user.name}</h3>
                                <h4 style={{ color: style }}>{user.deg}</h4>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}