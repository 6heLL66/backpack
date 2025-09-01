import {
    Card,
    CardBody
} from '@heroui/react';

export const Dashboard = () => {
    return (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-300 hover:bg-gray-800/50">
            <CardBody className="p-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
                    Dashboard
                </h1>
                <p className="text-gray-400 text-lg">Welcome to your dashboard overview</p>
            </CardBody>
        </Card>
    )
}