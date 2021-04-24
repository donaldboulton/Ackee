import { createElement as h, useState } from 'react'

import * as events from '../../../../constants/events'

import Input from '../Input'
import Select from '../Select'
import Label from '../Label'
import Spinner from '../Spinner'
import Spacer from '../Spacer'
import Tooltip from '../Tooltip'

import useCreateEvent from '../../api/hooks/useCreateEvent'
import commonModalProps from '../../utils/commonModalProps'
import shortId from '../../utils/shortId'

const ModalEventAdd = (props) => {

	const createEvent = useCreateEvent()

	const fetching = createEvent.fetching === true

	const [ inputs, setInputs ] = useState({
		title: '',
		type: events.EVENTS_TYPE_TOTAL_CHART
	})

	const onChange = (key) => (e) => setInputs({
		...inputs,
		[key]: e.target.value
	})

	const onSubmit = (e) => {
		e.preventDefault()
		createEvent.mutate({
			variables: {
				input: inputs
			}
		}).then(props.closeModal)
	}

	const titleId = shortId()
	const typeId = shortId()

	return (
		h('form', { className: 'card', onSubmit },
			h('div', { className: 'card__inner' },

				h(Spacer, { size: 0.5 }),

				h(Label, { htmlFor: titleId }, 'Event title'),

				h(Input, {
					type: 'text',
					id: titleId,
					required: true,
					disabled: fetching === true,
					focused: true,
					placeholder: 'Event title',
					value: inputs.title,
					onChange: onChange('title')
				}),

				h('div', { className: 'card__group' },
					h(Label, { spacing: false, htmlFor: typeId }, 'Event type'),
					h(Tooltip, {}, 'Specifies how the aggregated data will be displayed in the UI. Can be changed at any time.')
				),

				h(Select, {
					id: typeId,
					required: true,
					disabled: fetching === true,
					value: inputs.type,
					items: [
						{
							value: events.EVENTS_TYPE_TOTAL_CHART,
							label: 'Chart with total sums'
						},
						{
							value: events.EVENTS_TYPE_AVERAGE_CHART,
							label: 'Chart with average values'
						},
						{
							value: events.EVENTS_TYPE_TOTAL_LIST,
							label: 'List with total sums'
						},
						{
							value: events.EVENTS_TYPE_AVERAGE_LIST,
							label: 'List with average values'
						}
					],
					onChange: onChange('type')
				})

			),
			h('div', { className: 'card__footer' },

				h('button', {
					type: 'button',
					className: 'card__button link',
					onClick: props.closeModal,
					disabled: props.active === false
				}, 'Close'),

				h('div', {
					className: 'card__separator'
				}),

				h('button', {
					className: 'card__button card__button--primary link color-white',
					disabled: fetching === true || props.active === false
				}, fetching === true ? h(Spinner) : 'Add')

			)
		)
	)

}

ModalEventAdd.propTypes = {
	...commonModalProps
}

export default ModalEventAdd