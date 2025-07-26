// Date-specific variables for DateExpressions component
export const dateVariables = {
	'Instrument Dates': [
		'$F_inst_cal_date',
		'$F_inst_due_date',
		'$F_inst_del_date',
		'$F_inst_issue_date',
		'$F_inst_rec_date'
	],
	'Work Dates': [
		'$F_in_date'
	]
};

// Text-specific variables for TextExpressions component
export const textVariables = {
	'Certificate Details': [
		'$F_cal_by',
		'$F_cal_by_sign',
		'$F_approved_by',
		'$F_emp_initials',
		'$F_approved_by_sign',
		'$F_cal_type',
		'$F_cert_url'
	],
	'Base Company Details': [
		'$F_com_name',
		'$F_com_address',
		'$F_com_phone',
		'$F_com_email',
		'$F_com_website',
		'$F_com_logo',
		'$F_com_acc_logo',
		'$F_sticker_header',
		'$F_com_billing_building_no',
		'$F_com_billing_street',
		'$F_com_billing_city',
		'$F_com_billing_state',
		'$F_com_billing_email',
		'$F_com_billing_zip',
		'$F_com_billing_phone1',
		'$F_com_billing_phone2',
		'$F_com_billing_fax',
		'$F_com_billing_website',
		'$F_com_billing_country',
		'$F_com_shipping_building_no',
		'$F_com_shipping_street',
		'$F_com_shipping_city',
		'$F_com_shipping_state',
		'$F_com_shipping_email',
		'$F_com_shipping_zip',
		'$F_com_shipping_phone1',
		'$F_com_shipping_phone2',
		'$F_com_shipping_fax',
		'$F_com_shipping_website',
		'$F_com_shipping_country'
	],
	'Instrument Details': [
		'$F_inst_name',
		'$F_inst_desc',
		'$F_inst_mf',
		'$F_inst_model',
		'$F_inst_range',
		'$F_inst_type',
		'$F_inst_uniqueno',
		'$F_inst_slno',
		'$F_inst_tag',
		'$F_inst_res',
		'$F_inst_received',
		'$F_inst_return',
		'$F_inst_acc',
		'$F_inst_cal_point',
		'$F_inst_lc',
		'$F_inst_remarks'
	],
	'Customer Details': [
		'$F_parent_cus_code',
		'$F_parent_cus_name',
		'$F_cus_name',
		'$F_cus_code',
		'$F_cus_short_name',
		'$F_cus_address',
		'$F_cus_phone',
		'$F_cus_email',
		'$F_cus_attn',
		'$F_website',
		'$F_cust_address_field1',
		'$F_cust_address_field2',
		'$F_cust_address_field3',
		'$F_cust_address_field4',
		'$F_cust_zip_code',
		'$F_cust_city',
		'$F_cust_location',
		'$F_cust_phone1',
		'$F_cust_phone2',
		'$F_cust_fax',
		'$F_cust_state',
		'$F_cust_country'
	],
	'Work Details': [
		'$F_work_no',
		'$F_cert_no',
		'$F_work_order',
		'$F_work_purchase_order',
		'$F_work_loc',
		'$F_amp_temp',
		'$F_humidity',
		'$F_ulr_no',
		'$F_accr_type',
		'$F_workflow_type',
		'$F_company_type',
		'$F_revision_type',
		'$F_revision_statement',
		'$F_collection_delivery',
		'$F_department',
		'$F_compliance',
		'$F_scope',
		'$F_subcon_details',
		'$F_remarks',
		'$F_customer_specific_requirements',
		'$F_instrument_specific_requirements',
		'$F_passed'
	]
};

// Combined variables for backward compatibility
export const dynamicVariables = {
	...textVariables,
	...dateVariables
};

// Flat arrays for easy access
export const allDateVariables = Object.values(dateVariables).flat();
export const allTextVariables = Object.values(textVariables).flat();
export const allDynamicVariables = [...allDateVariables, ...allTextVariables];

// Date variable descriptions
export const dateVariableDescriptions: Record<string, string> = {
	'$F_inst_cal_date': 'Calibration Date',
	'$F_inst_due_date': 'Due Date',
	'$F_inst_del_date': 'Delivery Date',
	'$F_inst_issue_date': 'Issue Date',
	'$F_inst_rec_date': 'Received Date',
	'$F_in_date': 'Input Date'
};

// Utility to validate dynamic variable
export const isValidDynamicVariable = (variable: string): boolean => {
	return allDynamicVariables.includes(variable);
};

// Utility to validate date variable
export const isValidDateVariable = (variable: string): boolean => {
	return allDateVariables.includes(variable);
};

// Utility to validate text variable
export const isValidTextVariable = (variable: string): boolean => {
	return allTextVariables.includes(variable);
};

// Utility to extract dynamic variables from text
export const extractDynamicVariables = (text: string): string[] => {
	const regex = /{{\s*([$a-zA-Z0-9_]+)\s*}}/g;
	const matches = [...text.matchAll(regex)];
	return matches.map((m) => m[1]).filter(isValidDynamicVariable);
};

// Utility to get date variable description
export const getDateVariableDescription = (variable: string): string => {
	return dateVariableDescriptions[variable] || '';
};
