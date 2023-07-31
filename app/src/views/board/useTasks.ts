import { useState } from "react"
import { ITask } from "../../context/types"

const useTasks = () => {
    const [Tasks, setTasks] = useState<ITask[]>([]);
    const [todoTasks, setTodoTasks] = useState<ITask[]>([]);
    const [WIPTasks, setWIPTasks] = useState<ITask[]>([]);
    const [oneTasks, setDoneTasks] = useState<ITask[]>([]);
}