import React, { ReactNode, ReactElement, Children } from "react";

interface ShowProps {
  children: ReactNode;
}

interface WhenProps {
  isTrue: boolean;
  children: ReactNode;
}

interface ElseProps {
  render?: ReactNode;
  children?: ReactNode;
}

export const Show: React.FC<ShowProps> & {
  When: React.FC<WhenProps>;
  Else: React.FC<ElseProps>;
} = (props) => {
  let when: ReactElement | null = null;
  let otherwise: ReactElement | null = null;

  Children.forEach(props.children, (child) => {
    if (React.isValidElement(child)) {
      if (child.props.isTrue === undefined) {
        otherwise = child;
      } else if (!when && child.props.isTrue === true) {
        when = child;
      }
    }
  });

  return when || otherwise;
};

Show.When = ({ isTrue, children }: WhenProps) =>
  isTrue ? <>{children}</> : null;
Show.Else = ({ render, children }: ElseProps) => <>{render || children}</>;
