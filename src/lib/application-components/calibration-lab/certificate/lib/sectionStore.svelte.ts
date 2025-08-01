let selectedSection = $state<any>(null);

export function getSelectedSection() {
	return selectedSection;
}

export function setSelectedSection(section: any) {
	selectedSection = section;
}

export function clearSelectedSection() {
	selectedSection = null;
}
