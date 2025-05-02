Gem-v2.0

Explanation

Mock NFC for Web Compatibility: The code uses a MockNfcPcsc object to simulate NFC reader and tag interactions. This is essential because the nfc-pcsc library (which would be used in a non-web environment) relies on Node.js and native system calls, which aren't directly available in a web browser. This mock object allows the web app to run and demonstrate the UI and logic without actual NFC hardware.
React Components: The UI is built using React components.
NFCWebApp: The main component that orchestrates the entire application. It manages state, handles NFC interactions (or mock interactions), and renders the UI.
Uses shadcn/ui components (Button, Input, Textarea, Dialog, etc.) for a modern, consistent look and feel.
Uses lucide-react for icons.
State Management:
useState is used extensively to manage the application's state:
nfc: Holds the NFC interface (mock or real).
readers: List of connected NFC readers.
selectedReader: The currently selected reader.
tagData: Data read from an NFC tag.
textToWrite: Text to write to an NFC tag.
isWriting: Flag indicating a write operation is in progress.
error: Any error message to display.
isReady: Indicates if an NFC reader is ready for use.
encryptionKey, isEncrypted: For handling data encryption.
password, isPasswordProtected, isVerifyingPassword, verifiedPassword: For NFC tag password protection.
showSettings, showHelp: Control visibility of dialogs.
activeTab: Controls which section (Read, Write, Settings) is displayed.
NFC Interaction (Mocked):
The MockNfcPcsc object simulates the core functions of a real NFC reader:
on('reader', callback): Simulates listening for reader connection/disconnection.
on('tag', callback): Simulates listening for tag detection.
read(), write(): Simulate reading and writing data.
encrypt(), decrypt(): Simulate data encryption/decryption.
setPassword(), verifyPassword(): Simulate password protection.
The useEffect hook with the empty dependency array [] simulates the initial connection. It sets up the mock reader and tag events. It also simulates disconnection on component unmount.
The useEffect hook with [nfc, selectedReader] dependency listens for reader events.
Error Handling:
The error state variable is used to display error messages in a dialog box.
Error messages are shown using the Alert component.
UI Structure:
The application has a header, a main content area, and a footer.
The main content area is divided into a sidebar (for actions/reader selection) and a main section (for read/write operations).
Dialogs are used for displaying errors, settings, and help information.
Key Features (Implemented in Mock):
Read NFC Tags: The handleRead function (with nfc.read()) simulates reading data from a tag.
Write to NFC Tags: The handleWrite function (with nfc.write()) simulates writing data to a tag, including optional encryption.
Encryption/Decryption: The nfc.encrypt() and nfc.decrypt() functions simulate basic encryption/decryption.
Password Protection: The handleSetPassword() and handleVerifyPassword() functions simulate setting and verifying a password on an NFC tag.
Reader Selection: The UI allows selecting an NFC reader (though in the mock, it's a simulated selection).
Ready Status: The UI displays whether an NFC reader is ready.
Help/Instructions: A help dialog provides basic instructions.
Animation:
The app uses framer-motion for animated transitions between the main content sections (Read Tag, Write to Tag, Settings).
Important Notes for Real-World Deployment:
nfc-pcsc: For a real-world application, you would need to use the nfc-pcsc library (which requires a Node.js backend) to communicate with actual NFC readers. This web app provides the front-end UI and logic.
Web vs. Native: Direct NFC interaction from a web browser is limited due to security restrictions. Libraries like nfc-pcsc typically require a backend server. This code is designed to simulate NFC for demonstration purposes within a web environment.
Security: The mock encryption is not secure for real-world use. You would need to use a proper cryptographic library (e.g., node-crypto in a Node.js backend) for any sensitive data. Similarly, real NFC password protection has complexities that are greatly simplified in this mock.
Browser Compatibility: The Web NFC API is still not universally supported. This app uses a mock for broader compatibility and to illustrate the concepts.

====================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  KeyRound,
  Nfc,
  Lock,
  Unlock,
  Loader2,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Shield,
  BookOpen,
  HelpCircle,
  XCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock nfc-pcsc (for web compatibility)
const MockNfcPcsc = {
  on: (event: string, callback: (data?: any) => void) => {
    console.log(`Mock NFC PCSC: Subscribed to event: ${event}`);
    // Store callbacks for later "emulation"
    if (event === 'reader') {
      MockNfcPcsc.readerCallback = callback;
    } else if (event === 'tag') {
      MockNfcPcsc.tagCallback = callback;
    } else if (event === 'error') {
      MockNfcPcsc.errorCallback = callback;
    }
  },
  // Simulate a reader being connected/disconnected.
  // In a real implementation, this would be triggered by actual hardware events.
  emitReaderEvent: (action: 'add' | 'remove', readerName: string) => {
    if (MockNfcPcsc.readerCallback) {
      MockNfcPcsc.readerCallback({
        reader: readerName,
        action: action,
      });
    }
  },
  // Simulate a tag being detected.
  // In a real implementation, this would be triggered by actual hardware events.
  emitTagEvent: (tag: any) => {
    if (MockNfcPcsc.tagCallback) {
      MockNfcPcsc.tagCallback(tag);
    }
  },
  // Simulate an error
  emitErrorEvent: (error: string) => {
    if (MockNfcPcsc.errorCallback) {
      MockNfcPcsc.errorCallback(error);
    }
  },
  // Mock methods for simulating NFC actions.  These would be replaced
  // with actual nfc-pcsc calls in a non-web environment.
  connect: (readerName: string) => {
    console.log(`Mock NFC PCSC: Connecting to reader: ${readerName}`);
    return Promise.resolve();
  },
  disconnect: (readerName: string) => {
    console.log(`Mock NFC PCSC: Disconnecting from reader: ${readerName}`);
    return Promise.resolve();
  },
  read: (readerName: string) => {
    console.log(`Mock NFC PCSC: Reading from reader: ${readerName}`);
    // Simulate reading data from a tag.  In a real implementation,
    // this would involve actual NFC commands.
    return Promise.resolve({
      data: Buffer.from('Hello NFC World!', 'utf-8'),
    });
  },
  write: (readerName: string, data: Buffer, options?: any) => {
    console.log(`Mock NFC PCSC: Writing to reader: ${readerName}`, data, options);
    // Simulate writing data to a tag.
    return Promise.resolve();
  },
  transceive: (readerName: string, data: Buffer) => {
    console.log(`Mock NFC PCSC: Transceiving with reader: ${readerName}`, data);
    return Promise.resolve(Buffer.from([]));
  },
  // Mock encryption/decryption (for demonstration purposes)
  encrypt: (data: Buffer, key: string) => {
    if (!key) {
      throw new Error('Encryption key is required');
    }
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data[i] + (parseInt(key) % 256));
    }
    return Buffer.from(encrypted, 'binary');
  },
  decrypt: (data: Buffer, key: string) => {
    if (!key) {
      throw new Error('Decryption key is required');
    }
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(data[i] - (parseInt(key) % 256));
    }
    return Buffer.from(decrypted, 'binary');
  },
  // Mock password protection
  setPassword: (readerName: string, password: string) => {
    console.log(`Mock NFC PCSC: Setting password on reader: ${readerName}`, password);
    return Promise.resolve();
  },
  verifyPassword: (readerName: string, password: string) => {
    console.log(`Mock NFC PCSC: Verifying password on reader: ${readerName}`, password);
    // Simulate password verification
    if (password === 'test') {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false); // Or reject, depending on desired behavior
    }
  },
};

const NFCWebApp = () => {
  const [nfc, setNfc] = useState<any>(MockNfcPcsc); // Use mock for web
  const [readers, setReaders] = useState<string[]>([]);
  const [selectedReader, setSelectedReader] = useState<string | null>(null);
  const [tagData, setTagData] = useState<string | null>(null);
  const [textToWrite, setTextToWrite] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [verifiedPassword, setVerifiedPassword] = useState<boolean | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState<'read' | 'write' | 'settings'>('read'); // Added tab state

  // Simulate reader connection on component mount for web (no actual connection)
  useEffect(() => {
    // Simulate a reader being added after a short delay
    const readerTimeout = setTimeout(() => {
      MockNfcPcsc.emitReaderEvent('add', 'Mock Reader 1');
      setReaders(['Mock Reader 1']);
      setSelectedReader('Mock Reader 1'); // Auto-select the mock reader
      setIsReady(true); // Mark NFC as ready
    }, 1000); // Simulate 1-second delay

    // Simulate tag detection (optional, for testing)
    const tagTimeout = setTimeout(() => {
      MockNfcPcsc.emitTagEvent({
        uid: '12-34-56-78', // Mock UID
        atqa: '00 04',       // Mock ATQA
        sak: '20',         // Mock SAK
        type: 'ISO_14443_4',
      });
    }, 2000)

    // Cleanup function to clear timeouts and "disconnect"
    return () => {
      clearTimeout(readerTimeout);
      clearTimeout(tagTimeout);
      // Simulate reader removal on unmount
      MockNfcPcsc.emitReaderEvent('remove', 'Mock Reader 1');
      setReaders([]);
      setSelectedReader(null);
      setIsReady(false);
    };
  }, []);

  // Handle NFC reader events (add/remove)
  useEffect(() => {
    if (!nfc) return;

    const handleReader = (reader: any) => {
      if (reader.action === 'add') {
        setReaders((prevReaders) => [...prevReaders, reader.reader]);
        if (!selectedReader) {
          setSelectedReader(reader.reader);
        }
        setIsReady(true); // Set ready when a reader is added
      } else if (reader.action === 'remove') {
        setReaders((prevReaders) =>
          prevReaders.filter((r) => r !== reader.reader)
        );
        if (selectedReader === reader.reader) {
          setSelectedReader(null);
        }
        if (readers.length === 0) {
          setIsReady(false); // No readers, set not ready
        }
      }
    };

    const handleError = (err: any) => {
      setError(err.message || 'An error occurred');
    };

    nfc.on('reader', handleReader);
    nfc.on('error', handleError);

    return () => {
      nfc.removeAllListeners?.('reader', handleReader); // Use optional chaining
      nfc.removeAllListeners?.('error', handleError);
    };
  }, [nfc, selectedReader, readers.length]);

  const handleRead = useCallback(async () => {
    if (!nfc || !selectedReader) {
      setError('No reader selected');
      return;
    }
    try {
      const tag = await nfc.read(selectedReader);
      let dataString = '';
      if (tag?.data) {
        dataString = tag.data.toString('utf-8');
      }
      setTagData(dataString);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to read tag');
      setTagData(null);
    }
  }, [nfc, selectedReader]);

  const handleWrite = useCallback(async () => {
    if (!nfc || !selectedReader) {
      setError('No reader selected');
      return;
    }
    if (!textToWrite) {
      setError('No text to write');
      return;
    }
    setIsWriting(true);
    try {
      let dataToWrite = Buffer.from(textToWrite, 'utf-8');
      if (isEncrypted && encryptionKey) {
        dataToWrite = nfc.encrypt(dataToWrite, encryptionKey);
      }
      await nfc.write(selectedReader, dataToWrite);
      setError(null);
      setTextToWrite(''); // Clear input after successful write
      setTagData('Successfully written to tag.');
    } catch (err: any) {
      setError(err.message || 'Failed to write tag');
    } finally {
      setIsWriting(false);
    }
  }, [nfc, selectedReader, textToWrite, isEncrypted, encryptionKey]);

  const handleSetPassword = async () => {
    if (!nfc || !selectedReader) {
      setError('No reader selected');
      return;
    }
    if (!password) {
      setError('Password cannot be empty');
      return;
    }
    try {
      await nfc.setPassword(selectedReader, password);
      setIsPasswordProtected(true);
      setError(null);
      setPassword(''); // Clear password input
    } catch (err: any) {
      setError(err.message || 'Failed to set password');
    }
  };

  const handleVerifyPassword = async () => {
    if (!nfc || !selectedReader) {
      setError('No reader selected');
      return;
    }
    if (!password) {
      setError('Password cannot be empty');
      return;
    }
    setIsVerifyingPassword(true);
    try {
      const isCorrect = await nfc.verifyPassword(selectedReader, password);
      setVerifiedPassword(isCorrect);
      setError(null);
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to verify password');
      setVerifiedPassword(false);
    } finally {
      setIsVerifyingPassword(false);
    }
  };

  const handleClearPassword = async () => {
    if (!nfc || !selectedReader) {
      setError('No reader selected');
      return;
    }
    try {
      // Mock clear password (replace with actual command if available)
      // await nfc.clearPassword(selectedReader);
      setIsPasswordProtected(false);
      setVerifiedPassword(null); // Reset verification state
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to clear password');
    }
  };

  // Function to simulate connecting to a reader (for web demo)
  const simulateConnect = () => {
    if (readers.length === 0) {
      MockNfcPcsc.emitReaderEvent('add', 'Mock Reader 1');
      setReaders(['Mock Reader 1']);
      setSelectedReader('Mock Reader 1');
      setIsReady(true);
    }
  };

  // Function to simulate disconnecting from a reader
  const simulateDisconnect = () => {
    if (readers.length > 0) {
      MockNfcPcsc.emitReaderEvent('remove', 'Mock Reader 1');
      setReaders([]);
      setSelectedReader(null);
      setIsReady(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'read':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Read NFC Tag</h2>
            <p className="mb-4">
              Place an NFC tag near the reader to read its data.
            </p>
            <Button
              onClick={handleRead}
              disabled={!isReady || !selectedReader}
              className="w-full"
            >
              <Nfc className="mr-2 h-4 w-4" />
              Read Tag
            </Button>
            {tagData && (
              <div className="mt-4 p-4 bg-gray-100 rounded-md border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Tag Data:</h3>
                <Textarea
                  readOnly
                  value={tagData}
                  className="w-full min-h-[100px]"
                />
              </div>
            )}
          </>
        );
      case 'write':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Write to NFC Tag</h2>
            <Textarea
              value={textToWrite}
              onChange={(e) => setTextToWrite(e.target.value)}
              placeholder="Enter text to write to the NFC tag"
              className="mb-4 w-full"
              disabled={!isReady || !selectedReader}
            />
            <div className="flex items-center mb-4">
              <Label htmlFor="encryptionKey" className="mr-2">
                Encryption Key:
              </Label>
              <Input
                id="encryptionKey"
                type="password"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                placeholder="Enter key"
                className="w-32"
                disabled={!isReady || !selectedReader}
              />
              <label className="ml-4 flex items-center">
                <input
                  type="checkbox"
                  checked={isEncrypted}
                  onChange={(e) => setIsEncrypted(e.target.checked)}
                  className="mr-2"
                  disabled={!isReady || !selectedReader}
                />
                Encrypt Data
              </label>
            </div>
            <Button
              onClick={handleWrite}
              disabled={!isReady || !selectedReader || isWriting}
              className="w-full"
            >
              {isWriting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Writing...
                </>
              ) : (
                <>
                  <Nfc className="mr-2 h-4 w-4" />
                  Write to Tag
                </>
              )}
            </Button>
          </>
        );
      case 'settings':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4">Tag Settings</h2>
            <div className="mb-4">
              <Label htmlFor="password" className="block mb-2">
                Password:
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full"
                disabled={!isReady || !selectedReader}
              />
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleSetPassword}
                disabled={!isReady || !selectedReader || isPasswordProtected}
                className="flex-1"
              >
                <Lock className="mr-2 h-4 w-4" />
                Set Password
              </Button>
              <Button
                onClick={handleVerifyPassword}
                disabled={!isReady || !selectedReader || !isPasswordProtected || isVerifyingPassword}
                className="flex-1"
              >
                {isVerifyingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Verify Password
                  </>
                )}
              </Button>
            </div>
            {verifiedPassword !== null && (
              <div className={cn(
                "mt-4 p-4 rounded-md border",
                verifiedPassword
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              )}>
                {verifiedPassword ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5 inline-block" />
                    Password is correct.
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-5 w-5 inline-block" />
                    Password is incorrect.
                  </>
                )}
              </div>
            )}
            {isPasswordProtected && (
              <Button
                onClick={handleClearPassword}
                variant="destructive"
                className="mt-4 w-full"
              >
                <Unlock className="mr-2 h-4 w-4" />
                Clear Password
              </Button>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Nfc className="mr-2 h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold">NFC Web App</h1>
          </div>
          <div className="flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => setShowHelp(true)}>
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Help</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => setShowSettings(true)}>
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-grow p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar for Navigation */}
          <aside className="md:w-64">
            <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
              <h2 className="text-lg font-semibold">Actions</h2>
              <Button
                variant={activeTab === 'read' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setActiveTab('read')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Read Tag
              </Button>
              <Button
                variant={activeTab === 'write' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setActiveTab('write')}
              >
                <Nfc className="mr-2 h-4 w-4" />
                Write to Tag
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Tag Settings
              </Button>
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Reader Status</h3>
                {isReady ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Ready
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="mr-2 h-5 w-5" />
                    Not Ready
                  </div>
                )}
                {readers.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Connected Readers:</h4>
                    <ul className="list-disc list-inside">
                      {readers.map((reader) => (
                        <li key={reader} className="text-sm">
                          {reader}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {!isReady && (
                <Button onClick={simulateConnect} className="w-full">
                  Simulate Connect
                </Button>
              )}
              {isReady && readers.length > 0 && (
                <Button onClick={simulateDisconnect} className="w-full">
                  Simulate Disconnect
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 bg-white rounded-lg shadow-md p-6">
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>

      <footer className="bg-gray-200 py-4 mt-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} NFC Web App. All rights reserved.</p>
        </div>
      </footer>

      {/* Error Dialog */}
      <Dialog open={!!error} onOpenChange={() => setError(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setError(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog (for future expansion) */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              <p>Application Settings (Placeholder)</p>
              {/* Add settings controls here in the future */}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help/Instructions Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Help & Instructions</DialogTitle>
            <DialogDescription>
              <h2 className="text-lg font-semibold mt-4">Reading NFC Tags</h2>
              <ol className="list-decimal list-inside mb-4">
                <li>Select the "Read Tag" action.</li>
                <li>Place an NFC tag near the connected reader.</li>
                <li>The tag data will be displayed.</li>
              </ol>

              <h2 className="text-lg font-semibold mt-4">Writing to NFC Tags</h2>
              <ol className="list-decimal list-inside mb-4">
                <li>Select the "Write to Tag" action.</li>
                <li>Enter the text you want to write.</li>
                <li>Optionally, enter an encryption key and check "Encrypt Data".</li>
                <li>Place an NFC tag near the connected reader.</li>
                <li>Click the "Write to Tag" button.</li>
              </ol>

              <h2 className="text-lg font-semibold mt-4">Tag Settings</h2>
              <ol className="list-decimal list-inside mb-4">
                <li>Select the "Tag Settings" action.</li>
                <li>Enter a password.</li>
                <li>Click "Set Password" to protect the tag.</li>
                <li>To verify the password, enter it and click "Verify Password".</li>
                <li>If needed, click "Clear Password" to remove protection.</li>
              </ol>

              <p className="mt-4">
                <strong>Important Notes:</strong>
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Ensure your NFC reader is connected and selected.</li>
                <li>This app simulates NFC functionality for demonstration.</li>
                <li>Actual NFC operations depend on the nfc-pcsc library and a compatible reader.</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowHelp(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NFCWebApp;