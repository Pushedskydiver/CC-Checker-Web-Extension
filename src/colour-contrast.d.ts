declare namespace CC {
  type ColorsProps = {
    background: string,
    foreground: string
  }

  type LevelsProps = {
    AALarge: string,
    AA: string,
    AAALarge: string,
    AAA: string
  }

  type BadgeProps = {
    color: string
  }

  type PickedColorProps = {
    key: ColorKeys,
    rgb: [number, number, number]
  }

  enum ColorKeys {
    background = 'background',
    foreground = 'foreground'
  }
}
