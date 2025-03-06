import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, RefreshCw, ExternalLink, CircleDollarSign, Send, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { TransactionType, TransactionStatus, type TokenTransaction } from '@/types';

// Format date to a readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Format transaction amount
const formatAmount = (amount: number, type: TransactionType, from: string, userId: string) => {
  // Determine if this is an incoming or outgoing transaction for the user
  const isIncoming = from !== userId && from !== 'system';
  
  // For regular transfers, show + or - based on direction
  if (type === TransactionType.TRANSFER) {
    return isIncoming ? `+${amount}` : `-${amount}`;
  }
  
  // For rewards and tips, always show as positive
  if (
    type === TransactionType.CONTRIBUTION_REWARD ||
    type === TransactionType.DISCUSSION_TIP ||
    type === TransactionType.COMMENT_TIP ||
    type === TransactionType.PAPER_REVIEW
  ) {
    return `+${amount}`;
  }
  
  // For fees, always show as negative
  if (type === TransactionType.PLATFORM_FEE) {
    return `-${amount}`;
  }
  
  return amount.toString();
};

const WalletPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    publicKey, 
    isConnected, 
    connect, 
    disconnect, 
    tokenBalance, 
    transactions, 
    refreshBalance, 
    refreshTransactions,
    isLoading 
  } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Refresh wallet data
  const handleRefresh = async () => {
    if (!isConnected) return;
    
    try {
      setIsRefreshing(true);
      await refreshBalance();
      await refreshTransactions();
    } catch (err) {
      console.error('Error refreshing wallet data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle sending tokens
  const handleSendTokens = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (!recipientAddress) {
      setError('Please enter a recipient address');
      return;
    }
    
    if (amount > tokenBalance) {
      setError('Insufficient funds');
      return;
    }
    
    try {
      setIsSending(true);
      setError(null);
      
      // In a real app, this would call a service to send tokens
      // For MVP, we'll just show a mock success message
      alert(`Tokens sent successfully!\n\nAmount: ${amount} OPS\nTo: ${recipientAddress}`);
      
      // Clear form fields
      setSendAmount('');
      setRecipientAddress('');
      
      // Refresh wallet data
      await handleRefresh();
    } catch (err: any) {
      console.error('Error sending tokens:', err);
      setError(err.message || 'Failed to send tokens. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  
  // Get transaction icon based on type
  const getTransactionIcon = (type: TransactionType, from: string, userId: string) => {
    const isIncoming = from !== userId && from !== 'system';
    
    switch (type) {
      case TransactionType.TRANSFER:
        return isIncoming ? <ArrowDown className="text-green-500" /> : <ArrowUp className="text-red-500" />;
      case TransactionType.CONTRIBUTION_REWARD:
      case TransactionType.DISCUSSION_TIP:
      case TransactionType.COMMENT_TIP:
      case TransactionType.PAPER_REVIEW:
        return <CircleDollarSign className="text-green-500" />;
      case TransactionType.PLATFORM_FEE:
        return <CircleDollarSign className="text-red-500" />;
      default:
        return <Clock />;
    }
  };
  
  // Get transaction status color
  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.COMPLETED:
        return 'text-green-500';
      case TransactionStatus.PENDING:
        return 'text-yellow-500';
      case TransactionStatus.FAILED:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You need to be signed in to access your wallet
            </p>
            <Button
              onClick={() => navigate('/auth/signin')}
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet</h1>
        
        <Button
          variant="outline"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={handleRefresh}
          isLoading={isRefreshing}
          disabled={!isConnected || isRefreshing}
        >
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Your Balance
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                  <LoadingSpinner size={24} />
                </div>
              ) : isConnected ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Address</h3>
                    <div className="mt-1 flex items-center">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono truncate">
                        {publicKey}
                      </code>
                      <button 
                        className="ml-2 text-primary hover:text-primary-600"
                        onClick={() => navigator.clipboard.writeText(publicKey || '')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">$OPS Token Balance</h3>
                    <p className="mt-1 text-3xl font-bold text-primary">{tokenBalance}</p>
                  </div>
                  
                  <div className="flex">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={disconnect}
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Connect your Phantom wallet to manage your $OPS tokens
                  </p>
                  <Button
                    onClick={connect}
                    leftIcon={<Wallet className="w-4 h-4" />}
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Send Tokens Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Send Tokens
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {!isConnected ? (
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Connect your wallet to send tokens
                </p>
              ) : (
                <form onSubmit={handleSendTokens} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <Input
                    label="Recipient Address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Enter Solana address"
                    required
                  />
                  
                  <Input
                    label="Amount"
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                  
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full"
                      isLoading={isSending}
                      disabled={isSending || !tokenBalance}
                    >
                      Send
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Transaction History
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <LoadingSpinner size={24} />
            </div>
          ) : !isConnected ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Connect your wallet to view transaction history
            </p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              No transactions found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">From/To</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Date</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: TokenTransaction) => (
                    <tr 
                      key={tx.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-2">
                            {getTransactionIcon(tx.type, tx.from, user?.id || '')}
                          </div>
                          <span>{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatAmount(tx.amount, tx.type, tx.from, user?.id || '')} $OPS
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono truncate">
                          {tx.from === user?.id ? tx.to : tx.from}
                        </code>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {formatDate(tx.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={getStatusColor(tx.status)}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletPage; 