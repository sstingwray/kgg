

export function toggle(id) {
    switch (id) {
        case 'ignition':
            return (() => {
                console.log(`Ignition is clicked`);
            });
    }    
} 