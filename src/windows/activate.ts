import { basename } from "path";
import { runVbsScript } from "./runVbsScript";

export async function activate(
  applicationPath: string,
  applicationWindowTitle: string
): Promise<void> {
  const escapedApplicationPath = applicationPath.replaceAll("\\", "\\\\");

  const script = `
SET WshShell = CreateObject("WScript.Shell")

IF NOT IsProcessRunning("${escapedApplicationPath}") THEN
  WshShell.Run """${escapedApplicationPath}"" -p1 -c"
END IF

WshShell.AppActivate("${applicationWindowTitle}")
SET WshShell = Nothing

ShowWindow "${basename(applicationPath)}", "${applicationWindowTitle}"

Function ShowWindow(BYVAL strProcessName, BYVAL strWindowTitle)
  SET WshShell = CreateObject( "WScript.Shell")

  ShowWindow = WshShell.Run( "PowerShell -ExecutionPolicy Bypass -Command ""Add-Type -MemberDefinition '" & _
    "[DllImport(\\""user32.dll\\"")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);" & _
    "[DllImport(\\""user32.dll\\"")] public static extern int SetForegroundWindow(IntPtr hwnd);' -Name PS -Namespace WindowsAPI;" & _
    "$hWnd = (Get-Process " & strProcessName & ").Where({ $_.MainWindowTitle -Match '" & strWindowTitle & "' }, 1).MainWindowHandle;" & _
    "[WindowsAPI.PS]::ShowWindow( $hWnd, 9 );[WindowsAPI.PS]::SetForegroundWindow( $hWnd );""", 0, True ) = 0

  SET WshShell = Nothing
End Function

FUNCTION IsProcessRunning(BYVAL strExecutablePath)
  DIM objWMIService, strWMIQuery

  strWMIQuery = "Select * from Win32_Process where ExecutablePath like '%" & strExecutablePath & "%'"

  SET objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!" & chr(92) & chr(92) & "." & chr(92) & "root" & chr(92) & "cimv2")
  SET colProcesses = objWMIService.ExecQuery(strWMIQuery)

  IF colProcesses.Count > 0 THEN
    IsProcessRunning = TRUE
  ELSE
    IsProcessRunning = FALSE
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
