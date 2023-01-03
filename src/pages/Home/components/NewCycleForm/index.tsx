import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { CycleContext } from "../../../../contexts/CyclesContext";


export function NewCycleForm(){
	const { activeCycle } = useContext(CycleContext);
	const { register } = useFormContext();

	return (
		<FormContainer>
			<label htmlFor="task">Vou trabalhar em</label>
			<TaskInput 
				id="task" 
				list="task-suggestion"
				placeholder="De um nome para o seu projeto"
				{...register("task")}
				disabled={!!activeCycle}
			/>

			<datalist id="task-suggestion">
				<option value="Projeto 1"/>
				<option value="Projeto 2"/>
				<option value="Projeto 3"/>
			</datalist>

			<label htmlFor="minutesAmount">Durante</label>
			<MinutesAmountInput 
				type="number" 
				id="minutesAmount" 
				placeholder="00"
				step={5}
				min={5}
				max={60}
				disabled={!!activeCycle}
				{...register("minutesAmount", { valueAsNumber: true })}
			/>

			<span>minutos</span>
		</FormContainer>
	);
}