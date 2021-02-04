import React, { useState, useEffect } from 'react';
import {
	Button,
	Form,
	FormGroup,
	Label,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
} from 'reactstrap';

const WorkoutEdit = (props) => {
	const [editDescription, setEditDescription] = useState('');
	const [editDefinition, setEditDefinition] = useState('');
	const [editResult, setEditResult] = useState('');

	const workoutUpdate = (event, workout) => {
		event.preventDefault();
		fetch(`http://localhost:3000/log/${props.workoutToUpdate.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				description: editDescription,
				definition: editDefinition,
				result: editResult,
			}),
			headers: new Headers({
				'Content-Type': 'application/json',
				Authorization: props.token,
			}),
		}).then((response) => {
			props.fetchWorkouts();
			props.updateOff();
		});
	};
	return (
		<>
			<Modal isOpen={true}>
				<ModalHeader>Log a Workout</ModalHeader>
				<ModalBody>
					<Form onSubmit={workoutUpdate}>
						<FormGroup>
							<Label htmlFor='description' />
							<Input
								name='description'
								value={editDescription}
								onChange={(e) => setEditDescription(e.target.value)}
							/>
						</FormGroup>
						<FormGroup>
							<Label htmlFor='definition' />
							<Input
								type='select'
								name='definition'
								value={editDefinition}
								defaultValue='Time'
								onChange={(e) => setEditDefinition(e.target.value)}
							>
								<option value='Time'>Time</option>
								<option value='Weight'>Weight</option>
								<option value='Distance'>Distance</option>
							</Input>
						</FormGroup>
						<FormGroup>
							<Label htmlFor='result' />
							<Input
								name='result'
								value={editResult}
								onChange={(e) => setEditResult(e.target.value)}
							/>
						</FormGroup>
						<Button type='submit'> Update!</Button>
					</Form>
				</ModalBody>
			</Modal>
		</>
	);
};
export default WorkoutEdit;
