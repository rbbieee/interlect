export class Preference {
  preferenceId: number;
  category: string;
  weight: number;
  value: number;

  constructor(preferenceId: number, category: string, weight: number, value: number) {
    this.preferenceId = preferenceId;
    this.category = category;
    this.weight = weight;
    this.value = value;
  }

  updatePreference(category: string, weight: number, value: number): void {
    this.category = category;
    this.weight = weight;
    this.value = value;
  }

  calculateMatchScore(): number {
    return 0;
  }
}
