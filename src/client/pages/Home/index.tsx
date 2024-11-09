import React, { useState } from 'react';

// CSS-in-JS styles
const styles = {
    container: {
        background: '#fff',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '900px',
        textAlign: 'center' as const,
        margin: '2rem auto',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2rem',
        color: '#3498db',
        marginBottom: '1.5rem',
    },
    input: {
        width: '70%',
        padding: '0.8rem',
        fontSize: '1rem',
        border: '1px solid #3498db',
        borderRadius: '8px',
        marginRight: '0.5rem',
        outline: 'none',
    },
    button: {
        padding: '0.8rem 1.5rem',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#2ecc71',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    errorMessage: {
        color: '#e74c3c',
        marginTop: '1rem',
        fontWeight: 'bold' as const,
    },
    attendanceHistory: {
        marginTop: '2rem',
        textAlign: 'left' as const,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginTop: '1rem',
    },
    th: {
        backgroundColor: '#3498db',
        color: '#fff',
        fontWeight: 'normal' as const,
        padding: '1rem',
        textAlign: 'left' as const,
    },
    td: {
        padding: '1rem',
        textAlign: 'left' as const,
        borderBottom: '1px solid #ddd',
        fontSize: '0.9rem',
        color: '#333',
    },
    trEven: {
        backgroundColor: '#f2f2f2',
    },
};

interface AttendanceRecord {
    rfidCode: string | null;
    fullName: string;
    attendanceTimeIn: string;
    onTime: boolean;
    studentCode: string | null;
    shift: string;
    date: string;
    nameDevice: string;
}

async function getAttendance(studentCode: string): Promise<AttendanceRecord[]> {
    try {
        const response = await fetch(`http://localhost:8088/api/v1/check?studentCode=${studentCode}`, {
            method: 'GET',
            headers: {
                'accept': '*/*',
            },
        });

        if (!response.ok) {
            return [];
        }

        const jsonResponse = await response.json();
        return jsonResponse.data as AttendanceRecord[];
    } catch (error) {
        console.error(error);
        return [];
    }
}

const Home: React.FC = () => {
    const [studentCode, setStudentCode] = useState<string>('');
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [error, setError] = useState<string>('');
    const [hasSearched, setHasSearched] = useState<boolean>(false);

    const handleSearch = async () => {
        setError('');
        setHasSearched(true);
        if (!studentCode) {
            setError('Please enter a student code');
            return;
        }
        const data = await getAttendance(studentCode);
        if (data.length === 0) {
            setError('No attendance records found.');
        } else {
            setError('');
        }
        setAttendanceData(data);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Check Attendance for Today</h1>
            <input
                type="text"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="Enter student code"
                style={styles.input}
            />
            <button onClick={handleSearch} style={styles.button}>Search</button>

            {error && <p style={styles.errorMessage}>{error}</p>}

            {attendanceData.length > 0 && !error ? (
                <div style={styles.attendanceHistory}>
                    <h2>Attendance History</h2>
                    <table style={styles.table}>
                        <thead>
                        <tr>
                            <th style={styles.th}>Full Name</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Shift</th>
                            <th style={styles.th}>Attendance Time In</th>
                            <th style={styles.th}>On Time</th>
                            <th style={styles.th}>Device</th>
                        </tr>
                        </thead>
                        <tbody>
                        {attendanceData.map((record, index) => (
                            <tr key={index} style={index % 2 === 0 ? styles.trEven : undefined}>
                                <td style={styles.td}>{record.fullName}</td>
                                <td style={styles.td}>{record.date}</td>
                                <td style={styles.td}>{record.shift}</td>
                                <td style={styles.td}>{record.attendanceTimeIn}</td>
                                <td style={styles.td}>{record.onTime ? "Yes" : "No"}</td>
                                <td style={styles.td}>{record.nameDevice}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                hasSearched && !attendanceData.length && <p>No attendance records found.</p>
            )}
        </div>
    );
}

export default Home;
