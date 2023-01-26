import { runVbsScript } from "./runVbsScript";

export async function activate(
  applicationPath: string,
  applicationWindowTitle: string
): Promise<void> {
  const script = `
DIM strApplicationPath, strApplicationWindowName, strApplicationBaseName

strApplicationPath = "${applicationPath.replaceAll("\\", "\\\\")}"
strApplicationWindowTitle = "${applicationWindowTitle}"

SET objFSO = CreateObject("Scripting.FileSystemObject")
strApplicationBaseName = objFSO.GetBaseName(strApplicationPath)
SET objFSO = Nothing

IF NOT isProcessRunning(strApplicationPath) THEN
  SET WshShell = CreateObject("WScript.Shell")
  WshShell.Run strApplicationPath
  WshShell.AppActivate strApplicationWindowTitle
  SET WshShell = Nothing
END IF

ShowWindow strApplicationBaseName, strApplicationWindowTitle

Function ShowWindow(BYVAL strProcessName, BYVAL strWindowTitle)
  SET WshShell = CreateObject( "WScript.Shell")

  ShowWindow = WshShell.Run( "PowerShell -ExecutionPolicy Bypass -Command ""Add-Type -MemberDefinition '" & _
    "[DllImport(\\""user32.dll\\"")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);" & _
    "[DllImport(\\""user32.dll\\"")] public static extern int SetForegroundWindow(IntPtr hwnd);' -Name PS -Namespace WindowsAPI;" & _
    "$hWnd = (Get-Process " & strProcessName & ").Where({ $_.MainWindowTitle -Match '" & strWindowTitle & "' }, 1).MainWindowHandle;" & _
    "[WindowsAPI.PS]::ShowWindow( $hWnd, 9 );[WindowsAPI.PS]::SetForegroundWindow( $hWnd );""", 0, True ) = 0

  SET WshShell = Nothing
End Function

FUNCTION isProcessRunning(BYVAL strExecutablePath)
  DIM objWMIService, strWMIQuery

  strWMIQuery = "Select * from Win32_Process where ExecutablePath like '%" & strExecutablePath & "%'"
  
  SET objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\.\\root\\cimv2") 

  IF objWMIService.ExecQuery(strWMIQuery).Count > 0 THEN
    isProcessRunning = TRUE
  ELSE
    isProcessRunning = FALSE
  END IF

  SET objWMIService = Nothing
END FUNCTION
`;

  try {
    await runVbsScript(script);
  } catch (e) {
    throw new Error(`Unable to activate application\n${e.message}`);
  }
}
