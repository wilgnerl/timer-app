import { differenceInSeconds } from "date-fns";
import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { 
	addNewCycleAction, 
	interruptCurrentCycleAction, 
	markCurrentcCycleAsFinishedAction 
} from "../reducers/cycle/actions";
import { Cycle, cyclesReducer } from "../reducers/cycle/reducer";

interface CreateCycleData{
    task: string
    minutesAmount: number
}

interface CyclesContextType {
	cycles: Cycle[]
	activeCycle: Cycle | undefined
	activeCycleId: string | null
	amountSecondsPassed: number
	markCurrentCycleAsFinished: () => void
	setSecondsPassed: (seconds: number) => void
	createNewCycle: (data: CreateCycleData) => void
	interruptCurrentCycle: () => void
}

export const CycleContext = createContext({} as CyclesContextType);

interface CyclesContextProvidesProps {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProvidesProps){
	const [cyclesState, dispatch] = useReducer(cyclesReducer, {
		cycles: [],
		activeCycleId: null
	}, () => {
		const storedStateAsJson = localStorage.getItem("@timer-app:cycles-state-1.0.0");

		if(storedStateAsJson){
			return JSON.parse(storedStateAsJson);
		}
	});

	const { cycles, activeCycleId } = cyclesState;

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

	const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(() => {
		if(activeCycle){
			return differenceInSeconds(new Date, new Date(activeCycle.startDate));
		}

		return 0;
	});

	useEffect(() => {
		const stateJSON = JSON.stringify(cyclesState);

		localStorage.setItem("@timer-app:cycles-state-1.0.0", stateJSON);
	}, [cyclesState]);

	

	function setSecondsPassed(seconds: number){
		setAmountSecondsPassed(seconds);
	}

	function markCurrentCycleAsFinished(){
		dispatch(markCurrentcCycleAsFinishedAction());
	}

	function createNewCycle(data: CreateCycleData){
		const id = String(new Date().getTime());
		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date()

		};

		dispatch(addNewCycleAction(newCycle));
		setAmountSecondsPassed(0);
	}

	function interruptCurrentCycle(){
		dispatch(interruptCurrentCycleAction());

	}
    
	return (
		<CycleContext.Provider 
			value={{ 
				activeCycle,
				activeCycleId,
				amountSecondsPassed,
				cycles,
				markCurrentCycleAsFinished,
				setSecondsPassed,
				createNewCycle,
				interruptCurrentCycle
			}}>
			{ children }
		</CycleContext.Provider>
	);
}