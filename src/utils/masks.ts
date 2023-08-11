function formatCPF(cpfString: string): string {
    if (cpfString === undefined) {
      return ''
    }
    
    const digits = cpfString.replace(/\D/g, '');

    if (digits.length === 11) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    } else {
      return digits;
    }
}

export default formatCPF