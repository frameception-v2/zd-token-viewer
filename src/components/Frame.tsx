"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, {
  AddFrame,
  SignIn as SignInCore,
  type Context,
} from "@farcaster/frame-sdk";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import { config } from "~/components/providers/WagmiProvider";
import { truncateAddress } from "~/lib/truncateAddress";
import { base, optimism } from "wagmi/chains";
import { useSession } from "next-auth/react";
import { createStore } from "mipd";
import { Label } from "~/components/ui/label";
import { PROJECT_TITLE, MOCK_TOKENS } from "~/lib/constants";

function TokenViewer() {
  const [address, setAddress] = useState("");
  const [tokens, setTokens] = useState<typeof MOCK_TOKENS>([]);

  const handleLookup = useCallback(() => {
    // Simulate token lookup with mock data
    setTokens(MOCK_TOKENS);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Viewer</CardTitle>
        <CardDescription>
          Paste an Ethereum address to view token balances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button onClick={handleLookup}>Lookup</Button>
        </div>
        
        {tokens.length > 0 && (
          <div className="space-y-2">
            <Label>Token Balances:</Label>
            <div className="space-y-1">
              {tokens.map((token) => (
                <div key={token.symbol} className="flex justify-between text-sm">
                  <span>{token.name}</span>
                  <span>
                    {token.balance} {token.symbol}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t mt-4">
          <Label className="block mb-2">What you can do:</Label>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li>View mock token balances</li>
            <li>Simulate wallet lookup</li>
            <li>See demo data</li>
          </ul>

          <Label className="block mt-4 mb-2">What you can&apos;t do yet:</Label>
          <ul className="text-sm space-y-1 list-disc pl-4 text-red-500">
            <li>Access real blockchain data</li>
            <li>View NFT collections</li>
            <li>See transaction history</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Frame() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<Context.FrameContext>();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);
      sdk.actions.ready({});
    };
    
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
      return () => sdk.removeAllListeners();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mb-4 text-neutral-900">
          {PROJECT_TITLE}
        </h1>
        <TokenViewer />
      </div>
    </div>
  );
}
