"use client";

import { Button, Input } from "@mui/joy";
import classNames from "classnames";
import posthog from "posthog-js";
import React, { useState } from "react";

interface Props {
  className?: string;
}

const Subscription = ({ className }: Props) => {
  const [email, setEmail] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleEmailChanged = (value: string) => {
    setEmail(value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubscribeButtonClick();
  };

  const handleSubscribeButtonClick = () => {
    if (subscribed) {
      return;
    }
    if (!validateEmail(email)) {
      return;
    }

    posthog.capture("Subscribe", {
      email,
    });
    setSubscribed(true);
  };

  return (
    <div className={classNames("w-full shadow border rounded-2xl p-4 sm:p-8", className)}>
      <div className="mb-2 sm:mb-4 flex flex-row justify-start items-center">
        <span className="text-3xl sm:text-6xl mr-2">💌</span>
        <span className="text-lg sm:text-2xl md:text-3xl leading-tight">Get the latest news of Memos.</span>
      </div>
      <form onSubmit={handleFormSubmit} className="flex flex-row justify-start items-center gap-4">
        {!subscribed && (
          <Input
            className="grow"
            type="email"
            placeholder="Type your email..."
            value={email}
            onChange={(event) => handleEmailChanged(event.target.value)}
          />
        )}
        <Button
          className={classNames(subscribed && "w-full")}
          type="submit"
          variant="outlined"
          color="primary"
          disabled={!validateEmail(email)}
          onClick={handleSubscribeButtonClick}
        >
          {subscribed ? "Subscription successful!" : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export default Subscription;
