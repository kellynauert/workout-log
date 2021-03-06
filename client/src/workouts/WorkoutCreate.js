import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Select } from 'reactstrap';

const WorkoutCreate = (props) => {
	const [description, setDescription] = useState('');
	const [definition, setDefinition] = useState('Time');
	const [result, setResult] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		fetch('http://localhost:3000/log/', {
			method: 'POST',
			body: JSON.stringify({
				description: description,
				definition: definition,
				result: result,
			}),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: props.token,
			}),
		})
			.then((response) => response.json())
			.then((logData) => {
				console.log(logData);
				setDescription('');
				setDefinition('Time');
				setResult('');
				props.fetchWorkouts();
			});
	};
	return (
		<>
			<h3>Log a Workout</h3>
			<Form onSubmit={handleSubmit}>
				<FormGroup>
					<Label htmlFor='description' />
					<Input
						name='description'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</FormGroup>
				<FormGroup>
					<Label htmlFor='definition' />
					<Input
						type='select'
						name='definition'
						value={definition}
						onChange={(e) => setDefinition(e.target.value)}
					>
						<option selected value='Time'>
							Time
						</option>
						<option value='Weight'>Weight</option>
						<option value='Distance'>Distance</option>
					</Input>
				</FormGroup>
				<FormGroup>
					<Label htmlFor='result' />
					<Input
						name='result'
						value={result}
						onChange={(e) => setResult(e.target.value)}
					/>
				</FormGroup>
				<Button type='submit'> Click to Submit</Button>
			</Form>
		</>
	);
};
export default WorkoutCreate;
