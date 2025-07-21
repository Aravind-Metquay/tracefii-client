// export function createModalState(initial: {
//     isMobile: boolean, isActive: boolean, sticky: boolean
// }) {
//     let isMobile = $state(initial.isMobile);
//     let isActive = $state(initial.isActive);

//     function getIsMobile() {
//         return isMobile
//     }
//     function setIsMobile(value: boolean) {
//         isMobile = value
//     }

//     function getIsActive() {
//         return isActive
//     }
//     function setIsActive(value: boolean) {
//         isActive = value
//     }

//     return {
//         sticky: initial.sticky,
//         getIsMobile,
//         setIsMobile,
//         getIsActive,
//         setIsActive,
//     }
// }


export function createModalState(initial: {
    isMobile: boolean, isActive: boolean, sticky: boolean
}) {
    let isMobile = $state(initial.isMobile);
    let isActive = $state(initial.isActive);

    return {
        get sticky() {
            return initial.sticky;
        },
        get isMobile() {
            return isMobile;
        },
        set isMobile(value) {
            isMobile = value;
        },
        get isActive() {
            return isActive;
        },
        set isActive(value) {
            isActive = value;
        },
    }
}