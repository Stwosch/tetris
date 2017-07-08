export function times(times: number, fn: any) {
    
    let output = "";

    for(let i = 0; i < times; i++) {
         output += fn(i);   
    }

    return output;
}