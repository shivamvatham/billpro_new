import { NestedLoopingChild } from "./common/NestedLoopingChild";

function NestedLooping() {
    const colleges = [
        {
            collegeId: 1,
            collegeName: "ABC Engineering College",
            city: "Ahmedabad",
            students: [
                {
                    studentId: 101,
                    name: "Shivam",
                    course: "Computer Engineering",
                    year: 3
                },
                {
                    studentId: 102,
                    name: "Rahul",
                    course: "Information Technology",
                    year: 2
                }
            ]
        },
        {
            collegeId: 2,
            collegeName: "XYZ Science College",
            city: "Delhi",
            students: [
                {
                    studentId: 201,
                    name: "Neha",
                    course: "BSc Computer Science",
                    year: 1
                },
                {
                    studentId: 202,
                    name: "Amit",
                    course: "BSc Mathematics",
                    year: 3
                }
            ]
        }
    ];

    return (
        <>
            <h1>Nested Looping Example</h1>
            <hr />
            {
                colleges.map((data) => (
                    <div key={data.collegeId} style={{ backgroundColor: '#ccc', padding: "10px", borderRadius: '10px', margin: '10px', borderBottom: '4px solid red' }}>
                        <NestedLoopingChild colleges={data} />
                    </div>
                ))
            }
        </>
    )
}

export default NestedLooping