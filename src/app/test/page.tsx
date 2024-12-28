"use client";
import Button from "@/Components/Common/Button";
import Checkbox from "@/Components/Common/Checkbox";
import InputField from "@/Components/Common/InputField";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/Common/Popover";
import { toast } from "@/Components/Common/Toast/use-toast";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { DatePickerField } from "@/Components/Common/DatePicker";
import { DateRangePicker } from "@/Components/Common/DateRangePicker";
import { RadioGroup, RadioGroupItem } from "@/Components/Common/RadioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Common/SelectionField";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/Components/Common/Tabs";
import { Modal } from "@/Components/Common/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Common/Table";
// import Loader from "@/Components/Common/Loader";

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <InputField label="User Name" />
      <Button
        title="Default"
        onClick={() =>
          toast({
            title: "Toast is here",
            description: "Toast descrription",
          })
        }
        className="w-[320px]"
      />
      <Button
        title="Outline Button"
        onClick={() =>
          toast({
            title: "Toast is here",
            description: "Toast descrription",
            variant: "destructive",
          })
        }
        className="w-[320px]"
        variant="outline"
      />
      <Button
        title="Open Modal"
        className="w-[320px]"
        variant="outline"
        onClick={() => setIsModalOpen(true)}
      />
      {/* Checkbox */}

      <Checkbox label="Remeber Me" />

      <Button title="Popover" onClick={() => setIsOpen(true)} />

      {/* Popover */}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger />
        <PopoverContent>
          <div className="flex flex-col w-full divide-y">
            <div className="p-2sm flex flex-col  gap-sm">
              <div className="flex items-center">
                <Icon icon="mdi:lock-outline" width={20} height={20} />
                <span className="text-md">Account settings</span>
              </div>
              <div className="flex items-center">
                <Icon icon="mdi:person-outline" width={20} height={20} />
                <span className="text-md">My Profile</span>
              </div>
              <div className="flex items-center">
                <Icon icon="mdi:person-outline" width={20} height={20} />
                <span className="text-md">My Profile</span>
              </div>
            </div>
            <div className="p-2sm flex flex-col  gap-sm">
              <div className="flex items-center">
                <Icon icon="mdi:lock" width={20} height={20} />
                <span className="text-md">Account settings</span>
              </div>
              <div className="flex items-center">
                <Icon icon="mdi:person" width={20} height={20} />
                <span className="text-md">My Profile</span>
              </div>
            </div>
            <div className="p-2sm">
              <div className="flex items-center">
                <Icon icon="mdi:logout" width={20} height={20} />
                <span className="text-md">Logout</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* DatePicker */}

      <DatePickerField
        label="Select Date"
        value={date}
        onChange={(e) => setDate(e)}
        placeholder="Select a date"
      />

      {/* DateRangePicker */}
      <DateRangePicker
        title="Select Date Range"
        startDate={dateRange[0] || undefined}
        endDate={dateRange[1] || undefined}
        setDateRange={setDateRange}
        placeholder="Select a date range"
      />

      {/* RadioGroup */}
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="option-one"
            id="option-one"
            label="Option One"
          />
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="option-two"
            id="option-two"
            label="Option Two"
            disabled
            description="this is for disabled description"
          />
        </div>
      </RadioGroup>

      {/* SlectionField */}
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      {/* <Loader /> */}

      {/* Tabs */}
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>

      {/* Modal */}

      <Modal
        title="Email address"
        open={isModalOpen}
        onOpenChange={() => setIsModalOpen(false)}
      >
        <div>
          <h1>hELO THIS SI MODAL</h1>
        </div>
      </Modal>

      {/* Table */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
