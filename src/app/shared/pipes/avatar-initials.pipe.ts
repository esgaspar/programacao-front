import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'avatarInitials', standalone: true })
export class AvatarInitialsPipe implements PipeTransform {
  transform(name: string | null | undefined): string {
    if (!name?.trim()) return '?';

    const words = name.trim().split(/\s+/).filter(w => w.length > 0);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    const first = words[0][0];
    const last = words[words.length - 1][0];
    return (first + last).toUpperCase();
  }
}
